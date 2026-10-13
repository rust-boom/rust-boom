/** Trusted safe-output handler: review one event-bound commit, then merge if all gates pass. */
export const ordinaryFile = filename => /^(?:readme\.md|resources\/(?:.+\.md|index\.json)|docs\/.+\.md|maintenance\/.+\.md)$/.test(filename)
  && !filename.split('/').some(part => ['AGENTS.md', 'CLAUDE.md', 'SKILL.md'].includes(part));

export function policy({ pr, files, decision, sha, defaultBranch, checks, reviews, threads }) {
  if (pr.state !== 'open' || pr.merged || pr.draft) return 'PR 已关闭、已合并或仍为草稿';
  if (pr.base.ref !== defaultBranch || pr.head.repo?.full_name !== pr.base.repo.full_name) return '目标不是默认分支或来源为 fork';
  if (pr.head.sha !== sha || !/^[a-f0-9]{40}$/.test(sha)) return '评审提交已过时';
  if (decision !== 'approve') return 'AI 未给出无问题结论';
  if (pr.labels.some(label => label.name === 'no-auto-merge')) return '维护者已禁止自动合并';
  if (!files.length || (files.some(file => !ordinaryFile(file.filename) || (file.previous_filename && !ordinaryFile(file.previous_filename))))) return '包含需要人工审核的路径';
  if (!checks.length || checks.some(check => check.status !== 'completed' || check.conclusion !== 'success')) return '当前提交的目录 CI 尚未全部通过';
  const latest = new Map();
  for (const review of [...reviews].sort((a, b) => a.id - b.id)) {
    if (['APPROVED', 'CHANGES_REQUESTED', 'DISMISSED'].includes(review.state)) latest.set(review.user.login, review.state);
  }
  if ([...latest.values()].includes('CHANGES_REQUESTED')) return '存在尚未解除的修改请求';
  if (threads.some(thread => !thread.isResolved)) return '存在未解决的评审讨论';
  if (pr.mergeable !== true || pr.mergeable_state !== 'clean') return 'GitHub 尚未确认可干净合并';
  return null;
}

export async function run({ github, core, context, items, allowAll = false }) {
  const { owner, repo } = context.repo;
  const event = context.payload;
  let prs = event.workflow_run?.pull_requests ?? [];
  if (event.workflow_run && prs.length === 0) {
    const open = await github.paginate(github.rest.pulls.list, { owner, repo, state: 'open', per_page: 100 });
    prs = open.filter(pr => pr.head.sha === event.workflow_run.head_sha);
  }
  const number = event.workflow_run ? (prs.length === 1 ? prs[0].number : null) : Number(event.inputs?.pr_number);
  const sha = event.workflow_run?.head_sha ?? null;
  if (!Number.isSafeInteger(number) || number < 1 || items.length !== 1) throw new Error('需要唯一、事件绑定的 PR 和单个评审结果');
  const item = items[0];
  if (!['approve', 'changes', 'uncertain'].includes(item.decision) || !item.summary?.trim() || !/^[a-f0-9]{40}$/.test(item.sha)) throw new Error('AI 评审结果不完整');
  const reviewedSHA = sha ?? item.sha;
  if (item.sha !== reviewedSHA) throw new Error('AI 评审 SHA 与 CI 事件不一致');
  const pr = (await github.rest.pulls.get({ owner, repo, pull_number: number })).data;
  if (pr.head.sha !== reviewedSHA || pr.state !== 'open') { core.info('PR 已更新或关闭，跳过过时评审'); return; }
  if (process.env.GH_AW_SAFE_OUTPUTS_STAGED === 'true') { core.info('staged 模式：不发布评审或合并'); return; }
  // COMMENT supports bot-authored PRs; GitHub forbids approving one's own PR.
  await github.rest.pulls.createReview({ owner, repo, pull_number: number, commit_id: reviewedSHA, event: 'COMMENT', body: `AI 评审：${item.decision}\n\n提交：${reviewedSHA}\n\n${item.summary.slice(0, 20000)}` });
  const files = await github.paginate(github.rest.pulls.listFiles, { owner, repo, pull_number: number, per_page: 100 });
  if (files.length !== pr.changed_files || files.length >= 3000) throw new Error('未能获取完整文件列表');
  const reviews = await github.paginate(github.rest.pulls.listReviews, { owner, repo, pull_number: number, per_page: 100 });
  const runs = await github.paginate(github.rest.actions.listWorkflowRuns, { owner, repo, workflow_id: 'catalog.yml', head_sha: reviewedSHA, event: 'pull_request', per_page: 100 });
  const checks = runs.filter(run => run.head_sha === reviewedSHA).sort((a, b) => b.id - a.id).slice(0, 1);
  // Octokit pagination of workflow-runs responses returns the workflow_runs array.
  const threads = [];
  let after = null;
  do {
    const data = await github.graphql(`query($owner:String!,$repo:String!,$number:Int!,$after:String){repository(owner:$owner,name:$repo){pullRequest(number:$number){reviewThreads(first:100,after:$after){nodes{isResolved}pageInfo{hasNextPage endCursor}}}}}`, { owner, repo, number, after });
    const page = data.repository.pullRequest.reviewThreads;
    threads.push(...page.nodes); after = page.pageInfo.hasNextPage ? page.pageInfo.endCursor : null;
  } while (after);
  const current = (await github.rest.pulls.get({ owner, repo, pull_number: number })).data;
  const repository = (await github.rest.repos.get({ owner, repo })).data;
  const reason = policy({ pr: current, files, decision: item.decision, sha: reviewedSHA, defaultBranch: repository.default_branch, checks, reviews, threads });
  if (reason) { core.info(`保留 PR：${reason}`); return; }
  // Expected SHA makes a concurrent head update fail instead of merging unreviewed code.
  const result = await github.rest.pulls.merge({ owner, repo, pull_number: number, sha: reviewedSHA, merge_method: 'squash' });
  if (!result.data.merged) throw new Error(`GitHub 拒绝合并：${result.data.message}`);
  core.info(`已合并 PR #${number}：${result.data.sha}`);
}
