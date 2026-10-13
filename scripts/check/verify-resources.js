/** Resource evidence collection. HTTP success is not a factual or maintenance approval. */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { loadResources, ROOT } from './catalog.js';

export function repositoryFromURL(value) {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || url.hostname !== 'github.com') return null;
    const [owner, repo] = url.pathname.split('/').filter(Boolean);
    if (!owner || !repo || !/^[\w.-]+$/.test(owner) || !/^[\w.-]+$/.test(repo)) return null;
    return `${owner}/${repo.replace(/\.git$/, '')}`;
  } catch { return null; }
}
export function badgeRepositories(body) {
  return [...body.matchAll(/https:\/\/img\.shields\.io\/github\/(stars|license)\/([\w.-]+\/[\w.-]+)/g)].map(m => ({ kind: m[1], repository: m[2] }));
}
export function checkBadges(body, repository, canonical = repository) {
  const paragraph = body.split(/\n\s*\n/).find(part => badgeRepositories(part).length || /img\.shields\.io\/badge\/license-/.test(part)) ?? '';
  const badges = badgeRepositories(paragraph);
  const customLicense = /https:\/\/img\.shields\.io\/badge\/license-/.test(paragraph)
    && [...body.matchAll(/https:\/\/github\.com\/([\w.-]+\/[\w.-]+)\/blob\/[^\s)]+\/(?:LICENSE[^\s)]*|COPYING[^\s)]*)/g)].some(match => [repository, canonical].some(repo => repo.toLowerCase() === match[1].toLowerCase()));
  const allowed = new Set([repository, canonical].map(value => value.toLowerCase()));
  const errors = [];
  for (const kind of ['stars', 'license']) {
    if (!(kind === 'license' && customLicense) && !badges.some(b => b.kind === kind && allowed.has(b.repository.toLowerCase()))) errors.push(`缺少对应 ${canonical} 的 ${kind} 徽章`);
  }
  for (const badge of badges) if (!allowed.has(badge.repository.toLowerCase())) errors.push(`${badge.kind} 徽章指向其他仓库：${badge.repository}`);
  return errors;
}

export async function verify(resource, body, { fetchImpl = fetch, token = '', documents = false } = {}) {
  const repository = repositoryFromURL(resource.url);
  const entry = { id: resource.id, title: resource.title, path: resource.path, url: resource.url, checked_at: new Date().toISOString(), result: 'manual', errors: [], notes: [], facts: null };
  if (!repository) { entry.notes.push('非 GitHub 主链接：需人工或 AI 实际读取官网资料核验；不自动生成仓库归属或协议结论'); return entry; }
  const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'rust-boom-resource-verification' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const api = async suffix => {
    const response = await fetchImpl(`https://api.github.com/repos/${repository}${suffix}`, { headers, signal: AbortSignal.timeout(15000) });
    if (!response.ok) return { status: response.status, data: null };
    return { status: response.status, data: await response.json() };
  };
  try {
    const response = await api('');
    if (!response.data) {
      entry.notes.push(`GitHub API 返回 ${response.status}；不能据此认定资源失效或停止维护`);
      entry.result = 'unavailable'; return entry;
    }
    const repo = response.data;
    if (repo.private === true) { entry.result = 'unavailable'; entry.notes.push('主仓库非公开，不将私有资料写入公开报告'); return entry; }
    entry.facts = { repository: repo.full_name, url: repo.html_url, description: repo.description, homepage: repo.homepage, archived: repo.archived, stars: repo.stargazers_count, pushed_at: repo.pushed_at, license: repo.license?.spdx_id ?? null, default_branch: repo.default_branch };
    entry.errors = checkBadges(body, repository, repo.full_name);
    if (/img\.shields\.io\/badge\/license-/.test(body)) entry.notes.push('自定义协议徽章需对照引用的协议文件核查，不凭徽章文字认定许可');
    if (repository.toLowerCase() !== repo.full_name.toLowerCase()) entry.notes.push(`仓库已更名/迁移到 ${repo.full_name}`);
    if (!repo.license || repo.license.spdx_id === 'NOASSERTION') entry.notes.push('GitHub 未识别标准协议，必须读取 LICENSE/各组件协议；不得宣称 MIT/Apache 等');
    if (repo.archived && resource.status !== 'archived') entry.notes.push('仓库 archived=true；需核对是否为历史版本或替代入口');
    if (new URL(resource.url).pathname.split('/').filter(Boolean).length > 2) entry.notes.push('已确认所属仓库，GitHub 子路径仍需实际读取核验');
    if (documents) {
      for (const [suffix, key] of [['/readme', 'readme'], ['/license', 'license_document']]) {
        const content = await api(suffix);
        if (content.data?.encoding === 'base64') entry[key] = { url: content.data.html_url, sha: content.data.sha, text: Buffer.from(content.data.content, 'base64').toString('utf8') };
        else entry.notes.push(`${key} 未能取得（HTTP ${content.status}），不得推断不存在`);
      }
    }
    entry.result = entry.errors.length ? 'needs-fix' : entry.notes.length ? 'manual' : 'metadata-checked';
    entry.notes.push('仓库信息和徽章核验不等于介绍/维护状态的事实核验');
  } catch (error) { entry.result = 'unavailable'; entry.notes.push(`请求失败：${error.name}；保留原状态`); }
  return entry;
}

export function changedResources(resources, base, head, root = ROOT) {
  if (![base, head].every(sha => /^[a-f0-9]{40}$/.test(sha))) throw new Error('核验基线必须是完整提交 SHA');
  const result = spawnSync('git', ['diff', '--name-only', '-z', base, head, '--', 'resources'], { cwd: root, encoding: 'utf8' });
  if (result.status !== 0) throw new Error(result.stderr.trim());
  const files = new Set(result.stdout.split('\0').filter(Boolean));
  return resources.filter(resource => files.has(resource.path));
}
export async function audit(resources, { root = ROOT, ...options } = {}) {
  const results = [];
  for (const resource of resources) {
    const result = await verify(resource, fs.readFileSync(path.join(root, resource.path), 'utf8'), options);
    results.push(result);
    console.log(`${results.length}/${resources.length} ${resource.id}: ${result.result}`);
  }
  return results;
}

export async function main(argv = process.argv.slice(2)) {
  const all = argv.includes('--all'), documents = argv.includes('--documents');
  const changed = argv.indexOf('--changed'), out = argv.indexOf('--out');
  if (!all && (changed < 0 || !argv[changed + 1] || !argv[changed + 2])) throw new Error('使用 --all 或 --changed BASE HEAD');
  const { resources } = loadResources();
  const selected = all ? resources : changedResources(resources, argv[changed + 1], argv[changed + 2]);
  const results = await audit(selected, { documents, token: process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '' });
  const filename = out >= 0 ? argv[out + 1] : '/tmp/resource-verification.json';
  fs.mkdirSync(path.dirname(filename), { recursive: true });
  fs.writeFileSync(filename, JSON.stringify({ version: 1, selection: all ? { all: true } : { base_sha: argv[changed + 1], head_sha: argv[changed + 2] }, results }, null, 2) + '\n');
  if (results.some(r => r.errors.length || r.result === 'unavailable')) process.exitCode = 1;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
}
