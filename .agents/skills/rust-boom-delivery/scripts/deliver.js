/** Deliver explicit reviewed task files, preserving unrelated work. */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

function run(command, args, cwd, check = true) {
  const result = spawnSync(command, args, { cwd, encoding: 'utf8' });
  if (result.error) throw result.error;
  if (check && result.status !== 0) throw new Error(`${command} ${args[0]} 失败: ${result.stderr.trim() || result.stdout.trim()}`);
  return result;
}
const git = (root, ...args) => run('git', args, root).stdout.trim();

export function validateFiles(root, files) {
  return [...new Set(files.map(filename => {
    const destination = path.resolve(root, filename);
    const relative = path.relative(root, destination);
    const outside = p => p === '..' || p.startsWith(`..${path.sep}`) || path.isAbsolute(p);
    if (path.isAbsolute(filename) || outside(relative)) throw new Error(`文件必须在仓库内: ${filename}`);
    // Resolve the nearest existing ancestor, including for tracked deletions.
    let ancestor = destination;
    while (!fs.existsSync(ancestor)) ancestor = path.dirname(ancestor);
    if (outside(path.relative(root, fs.realpathSync(ancestor)))) throw new Error(`文件必须在仓库内: ${filename}`);
    if (relative === '.git' || relative.startsWith(`.git${path.sep}`) || (fs.existsSync(destination) && fs.statSync(destination).isDirectory())) throw new Error(`只能指定具体任务文件: ${filename}`);
    if (!fs.existsSync(destination) && run('git', ['--literal-pathspecs', 'ls-files', '--error-unmatch', '--', relative], root, false).status !== 0) {
      const committed = run('git', ['cat-file', '-t', `HEAD:${relative}`], root, false);
      if (committed.status !== 0 || committed.stdout.trim() !== 'blob') throw new Error(`文件不存在且不是已跟踪的删除项: ${filename}`);
    }
    return relative.split(path.sep).join('/');
  }))];
}

function argumentsFrom(argv) {
  const args = { execute: false, files: [] };
  const options = new Set(['branch', 'message', 'title', 'body-file']);
  for (let i = 0; i < argv.length; i++) {
    const option = argv[i];
    if (option === '--execute') args.execute = true;
    else if (option === '--files') {
      while (i + 1 < argv.length && !argv[i + 1].startsWith('--')) args.files.push(argv[++i]);
    } else if (options.has(option.slice(2)) && option.startsWith('--') && argv[i + 1] && !argv[i + 1].startsWith('--')) args[option.slice(2)] = argv[++i];
    else throw new Error(`未知选项或缺少值: ${option}`);
  }
  if ([...options].some(key => !args[key]) || !args.files.length) throw new Error('需要 --branch、--message、--title、--body-file 和 --files');
  return args;
}

export function main(argv = process.argv.slice(2), cwd = process.cwd()) {
  const args = argumentsFrom(argv);
  const root = fs.realpathSync(run('git', ['rev-parse', '--show-toplevel'], cwd).stdout.trim());
  if (!/^codex\/[a-z0-9][a-z0-9/-]*$/.test(args.branch)) throw new Error('任务分支必须是 codex/<task>');
  git(root, 'check-ref-format', '--branch', args.branch);
  if (!/^(feat|fix|docs|test|refactor|chore|build|ci|perf)(\([^)]+\))?!?: .+/.test(args.message)) throw new Error('提交信息必须使用 Conventional Commits');
  if (/[\r\n]/.test(args.message) || !args.title.trim() || /[\r\n]/.test(args.title)) throw new Error('提交和 PR 标题必须是非空单行');
  const bodyFile = path.resolve(cwd, args['body-file']);
  if (!fs.existsSync(bodyFile) || !fs.statSync(bodyFile).isFile() || !fs.readFileSync(bodyFile, 'utf8').trim()) throw new Error('需要非空的 PR 正文文件');
  const files = validateFiles(root, args.files);
  const staged = run('git', ['diff', '--cached', '--name-only', '-z'], root).stdout.split('\0').filter(Boolean);
  if (staged.some(file => !files.includes(file))) throw new Error(`存在未授权暂存项: ${staged.filter(file => !files.includes(file)).join(', ')}`);
  if (git(root, 'diff', '--name-only', '--diff-filter=U')) throw new Error('存在未解决的合并冲突');
  const current = git(root, 'branch', '--show-current');
  if (!current) throw new Error('当前是 detached HEAD，需要先确定任务基线');
  if (current !== args.branch && run('git', ['show-ref', '--verify', '--quiet', `refs/heads/${args.branch}`], root, false).status === 0) throw new Error('目标任务分支已存在，请检查并切换到该分支后重试');
  console.log(JSON.stringify({ mode: args.execute ? 'execute' : 'plan', current_branch: current, task_branch: args.branch, files, title: args.title }));
  if (!args.execute) return;
  run('gh', ['auth', 'status'], root);
  const remote = git(root, 'remote', 'get-url', 'origin');
  let selector = remote;
  const ssh = remote.match(/^git@([^:]+):(.+)$/);
  if (ssh) selector = `${ssh[1]}/${ssh[2].replace(/\.git$/, '')}`;
  else if (/^(https|ssh):\/\//.test(remote)) {
    const url = new URL(remote);
    selector = `${url.hostname}/${url.pathname.replace(/^\/+|\/+$/g, '').replace(/\.git$/, '')}`;
  }
  const repo = JSON.parse(run('gh', ['repo', 'view', selector, '--json', 'nameWithOwner,defaultBranchRef'], root).stdout);
  const base = repo.defaultBranchRef.name;
  if ([base, 'master', 'main', 'develop'].includes(args.branch)) throw new Error('禁止直接 Push 默认/受保护分支');
  git(root, 'fetch', 'origin', base);
  if (current !== args.branch) {
    if (git(root, 'rev-parse', 'HEAD') !== git(root, 'rev-parse', `origin/${base}`)) throw new Error('新任务分支的基线不是最新 origin 默认分支，请先处理差异；不会 reset/stash 用户工作');
    git(root, 'switch', '-c', args.branch);
  }
  const pathsToStage = files.filter(file => fs.existsSync(path.join(root, file)) || !staged.includes(file));
  if (pathsToStage.length) git(root, '--literal-pathspecs', 'add', '--', ...pathsToStage);
  git(root, 'diff', '--cached', '--check');
  const changed = run('git', ['diff', '--cached', '--quiet'], root, false).status;
  if (![0, 1].includes(changed)) throw new Error('无法检查暂存改动');
  if (changed === 1) {
    console.log(git(root, 'diff', '--cached', '--stat'));
    git(root, 'commit', '-m', args.message);
  }
  if (git(root, 'rev-list', '--count', `origin/${base}..HEAD`) === '0') { console.log('没有任务提交，不 Push 或创建空 PR。'); return; }
  git(root, 'push', '--set-upstream', 'origin', args.branch);
  const prs = JSON.parse(run('gh', ['pr', 'list', '--repo', selector, '--head', args.branch, '--state', 'open', '--json', 'number,url,baseRefName'], root).stdout);
  if (prs.length > 1) throw new Error('同一任务分支存在多个 PR，请人工确定更新对象');
  let url;
  if (prs.length) {
    if (prs[0].baseRefName !== base) throw new Error('已有 PR 的目标不是默认分支，未自动更改');
    run('gh', ['pr', 'edit', String(prs[0].number), '--repo', selector, '--title', args.title, '--body-file', bodyFile], root);
    url = prs[0].url;
  } else url = run('gh', ['pr', 'create', '--repo', selector, '--base', base, '--head', args.branch, '--title', args.title, '--body-file', bodyFile], root).stdout.trim();
  console.log(JSON.stringify({ commit: git(root, 'rev-parse', 'HEAD'), branch: args.branch, repository: repo.nameWithOwner, pr: url }));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { main(); } catch (error) { console.error(`交付停止: ${error.message}。已完成的提交/Push 会保留，未自动回滚。`); process.exitCode = 1; }
}
