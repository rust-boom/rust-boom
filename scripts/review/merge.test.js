import test from 'node:test';
import assert from 'node:assert/strict';
import { policy, ordinaryFile, run } from './merge.js';
const sha = 'a'.repeat(40);
function fixture() {
  return { pr: { state: 'open', merged: false, draft: false, base: { ref: 'master', repo: { full_name: 'test/repo' } }, head: { sha, repo: { full_name: 'test/repo' } }, labels: [], mergeable: true, mergeable_state: 'clean' }, files: [{ filename: 'resources/learning/articles/sample.md' }], decision: 'approve', sha, defaultBranch: 'master', checks: [{ status: 'completed', conclusion: 'success' }], reviews: [], threads: [] };
}
test('eligible resource/document files are bounded', () => {
  for (const file of ['readme.md', 'resources/index.json', 'resources/tools/readme.md', 'docs/topic/readme.md', 'maintenance/structure.md']) assert.equal(ordinaryFile(file), true);
  for (const file of ['AGENTS.md', '.github/workflows/catalog.yml', '.agents/skills/a/SKILL.md', 'scripts/check/catalog.js', 'package-lock.json', 'resources/categories.json', 'docs/topic/main.rs', 'docs/topic/AGENTS.md']) assert.equal(ordinaryFile(file), false);
});
test('policy requires current clean PR, CI, review verdict and conversations', () => {
  assert.equal(policy(fixture()), null);
  const mutations = [
    f => f.pr.state = 'closed', f => f.pr.draft = true, f => f.pr.head.sha = 'b'.repeat(40),
    f => f.pr.base.ref = 'other', f => f.pr.head.repo.full_name = 'fork/repo',
    f => f.decision = 'changes', f => f.decision = 'uncertain',
    f => f.pr.labels.push({ name: 'no-auto-merge' }), f => f.files.push({ filename: 'scripts/test.js' }),
    f => f.files.push({ filename: 'readme.md', previous_filename: 'AGENTS.md' }),
    f => f.checks = [], f => f.checks[0].conclusion = 'failure', f => f.checks[0].status = 'in_progress',
    f => f.reviews.push({ id: 1, user: { login: 'maintainer' }, state: 'CHANGES_REQUESTED' }),
    f => f.threads.push({ isResolved: false }), f => f.pr.mergeable = null, f => f.pr.mergeable_state = 'blocked',
  ];
  for (const mutate of mutations) { const f = fixture(); mutate(f); assert.equal(typeof policy(f), 'string'); }
});
test('newer approval or dismissal supersedes old change request', () => {
  for (const state of ['APPROVED', 'DISMISSED']) {
    const f = fixture(); f.reviews = [{ id: 2, user: { login: 'human' }, state }, { id: 1, user: { login: 'human' }, state: 'CHANGES_REQUESTED' }];
    assert.equal(policy(f), null);
  }
});
function mock(options = {}) {
  const f = fixture(), calls = [], pr = { ...f.pr, changed_files: 1 };
  const list = async () => {}, files = async () => {}, reviews = async () => {}, runs = async () => {};
  const github = {
    rest: {
      pulls: { list, listFiles: files, listReviews: reviews, get: async () => ({ data: { ...pr, head: { ...pr.head, sha: options.newSHA ?? sha } } }), createReview: async arg => calls.push(['review', arg]), merge: async arg => { calls.push(['merge', arg]); return { data: { merged: true, sha } }; } },
      actions: { listWorkflowRuns: runs }, repos: { get: async () => ({ data: { default_branch: 'master' } }) },
    },
    paginate: async method => method === list ? [{ ...pr, number: 12 }] : method === files ? f.files : method === reviews ? [] : [{ id: 5, head_sha: sha, ...f.checks[0], conclusion: options.ci ?? 'success' }],
    graphql: async () => ({ repository: { pullRequest: { reviewThreads: { nodes: [], pageInfo: { hasNextPage: false } } } } }),
  };
  return { github, core: { info() {} }, context: { repo: { owner: 'test', repo: 'repo' }, payload: { workflow_run: { head_sha: sha, pull_requests: [] } } }, items: [{ decision: options.decision ?? 'approve', sha, summary: '已检查全部 diff 和来源，没有问题。' }], calls };
}
test('empty workflow_run PR array resolves by SHA and merge pins exact head', async () => {
  const f = mock(); await run(f); assert.deepEqual(f.calls.map(call => call[0]), ['review', 'merge']);
  assert.equal(f.calls[1][1].sha, sha); assert.equal(f.calls[1][1].merge_method, 'squash'); assert.equal(f.calls[0][1].event, 'COMMENT');
});
test('stale head never publishes a review or merges', async () => { const f = mock({ newSHA: 'b'.repeat(40) }); await run(f); assert.equal(f.calls.length, 0); });
test('negative verdict and failed CI publish review without merging', async () => {
  for (const options of [{ decision: 'changes' }, { ci: 'failure' }]) { const f = mock(options); await run(f); assert.deepEqual(f.calls.map(call => call[0]), ['review']); }
});
test('multiple AI decisions cannot trigger merge', async () => { const f = mock(); f.items.push(f.items[0]); await assert.rejects(run(f), /单个评审/); assert.equal(f.calls.length, 0); });
