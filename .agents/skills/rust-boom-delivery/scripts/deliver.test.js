import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const script = fileURLToPath(new URL('./deliver.js', import.meta.url));
function fixture(t) {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), 'delivery-js-')), repo = `${base}/repo`, remote = `${base}/remote.git`;
  t.after(() => fs.rmSync(base, { recursive: true, force: true })); fs.mkdirSync(repo);
  const git = (...args) => { const r = spawnSync('git', args, { cwd: repo, encoding: 'utf8' }); assert.equal(r.status, 0, r.stderr); return r.stdout.trim(); };
  git('init', '--bare', remote); git('init', '-b', 'master'); git('config', 'user.name', 'Delivery Test'); git('config', 'user.email', 'test@example.invalid');
  for (const name of ['task.txt', 'user.txt']) fs.writeFileSync(`${repo}/${name}`, 'original\n');
  git('add', 'task.txt', 'user.txt'); git('commit', '-m', 'test: initialize'); git('remote', 'add', 'origin', remote); git('push', 'origin', 'master'); const initial = git('rev-parse', 'HEAD');
  fs.writeFileSync(`${repo}/task.txt`, 'task update\n'); fs.writeFileSync(`${repo}/user.txt`, 'unrelated user update\n'); fs.writeFileSync(`${base}/body.md`, 'Update task.\n\nCloses #123\n'); fs.mkdirSync(`${base}/bin`);
  const state = `${base}/gh-state.json`;
  fs.writeFileSync(`${base}/bin/gh`, `#!${process.execPath}\nconst fs = require('node:fs');\nconst args = process.argv.slice(2), key = args.slice(0,2).join(' '), state = process.env.GH_FAKE_STATE;\nif (key === 'auth status') process.exit(process.env.GH_FAKE_AUTH_FAIL ? 1 : 0);\nelse if (key === 'repo view') console.log(JSON.stringify({nameWithOwner:'test/repo',defaultBranchRef:{name:'master'}}));\nelse if (key === 'pr list') console.log(fs.existsSync(state) ? fs.readFileSync(state,'utf8') : '[]');\nelse if (key === 'pr create') { fs.writeFileSync(state,JSON.stringify([{number:1,url:'https://github.com/test/repo/pull/1',baseRefName:'master'}])); console.log('https://github.com/test/repo/pull/1'); }\nelse if (key !== 'pr edit') process.exit(2);\n`, { mode: 0o755 });
  const env = { ...process.env, PATH: `${base}/bin${path.delimiter}${process.env.PATH}`, GH_FAKE_STATE: state };
  const deliver = (execute = false, branch = 'codex/update', files = ['task.txt']) => spawnSync(process.execPath, [script, '--branch', branch, '--message', 'docs: update task', '--title', 'Update task', '--body-file', `${base}/body.md`, ...(execute ? ['--execute'] : []), '--files', ...files], { cwd: repo, env, encoding: 'utf8' });
  return { git, deliver, initial, state, env };
}
test('plan does not mutate Git', t => { const f = fixture(t), r = f.deliver(); assert.equal(r.status,0,r.stderr); assert.equal(f.git('branch','--show-current'),'master'); assert.equal(f.git('rev-parse','HEAD'),f.initial); assert.equal(f.git('diff','--cached','--name-only'),''); assert.equal(fs.existsSync(f.state),false); });
test('only task files are pushed; retry reuses commit and PR', t => {
  const f = fixture(t), r = f.deliver(true); assert.equal(r.status,0,r.stderr); const commit = f.git('rev-parse','HEAD');
  assert.equal(f.git('branch','--show-current'),'codex/update'); assert.equal(f.git('show','origin/codex/update:task.txt'),'task update'); assert.equal(f.git('show','origin/codex/update:user.txt'),'original'); assert.equal(f.git('diff','--name-only'),'user.txt');
  const retry=f.deliver(true); assert.equal(retry.status,0,retry.stderr); assert.equal(f.git('rev-parse','HEAD'),commit); assert.equal(JSON.parse(fs.readFileSync(f.state,'utf8')).length,1);
});
test('unrelated staged changes are preserved', t => { const f=fixture(t); f.git('add','user.txt'); assert.notEqual(f.deliver(true).status,0); assert.equal(f.git('diff','--cached','--name-only'),'user.txt'); assert.equal(f.git('rev-parse','HEAD'),f.initial); });
test('authentication failure precedes Git mutations', t => { const f=fixture(t); f.env.GH_FAKE_AUTH_FAIL='1'; assert.notEqual(f.deliver(true).status,0); assert.equal(f.git('branch','--show-current'),'master'); assert.equal(f.git('diff','--cached','--name-only'),''); });
test('protected branches and outside paths are refused', t => { const f=fixture(t); assert.notEqual(f.deliver(true,'master').status,0); assert.notEqual(f.deliver(true,'codex/update',['../body.md']).status,0); assert.equal(f.git('rev-parse','HEAD'),f.initial); assert.equal(fs.existsSync(f.state),false); });

test('staged tracked deletions can be delivered', t => { const f = fixture(t); f.git('rm', '-f', 'task.txt'); const result = f.deliver(true); assert.equal(result.status, 0, result.stderr); assert.equal(f.git('ls-tree', '--name-only', 'origin/codex/update', '--', 'task.txt'), ''); assert.equal(f.git('diff', '--name-only'), 'user.txt'); });
