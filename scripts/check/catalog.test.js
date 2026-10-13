import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { stringify, parse } from 'yaml';
import { loadResources, outputs, checkLocalLinks, main } from './catalog.js';

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'catalog-js-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const categories = [{ id: 'libraries/async', group: '开发库与框架', title: '异步' }];
  const data = { id: 'sample', title: 'Sample', category: 'libraries/async', url: 'https://example.org/sample', status: 'unknown' };
  const taxonomy = () => { fs.mkdirSync(`${root}/resources`, { recursive: true }); fs.writeFileSync(`${root}/resources/categories.json`, JSON.stringify(categories)); };
  const write = (value = data, body = `# ${value.title}\n\n介绍。\n`) => {
    const filename = `${root}/resources/${value.category}/${value.id}.md`;
    fs.mkdirSync(path.dirname(filename), { recursive: true }); fs.writeFileSync(filename, `---\n${stringify(value)}---\n\n${body}`); return filename;
  };
  for (const filename of ['readme.md', 'CONTRIBUTING.md', 'docs/readme.md']) {
    fs.mkdirSync(path.dirname(`${root}/${filename}`), { recursive: true }); fs.writeFileSync(`${root}/${filename}`, '# 导航\n');
  }
  taxonomy(); write(); return { root, categories, data, taxonomy, write };
}
test('deterministic navigation, index and category options', t => {
  const f = fixture(t), { categories, resources } = loadResources(f.root), result = outputs(categories, resources);
  assert.deepEqual(result, outputs(categories, resources.toReversed()));
  assert.match(result['resources/libraries/readme.md'], /async\/sample.md/);
  assert.equal(JSON.parse(result['resources/index.json'])[0].id, 'sample');
  assert.deepEqual(parse(result['.github/ISSUE_TEMPLATE/resource.yml']).body.find(f => f.id === 'category').attributes.options, ['libraries/async']);
});
test('link Issue requires only URL', t => {
  const f = fixture(t), { categories, resources } = loadResources(f.root);
  const form = parse(outputs(categories, resources)['.github/ISSUE_TEMPLATE/resource-link.yml']);
  assert.deepEqual(form.body.filter(f => f.validations?.required).map(f => f.id), ['url']);
  assert.deepEqual(form.body.find(f => f.id === 'operation').attributes.options, ['auto', 'add', 'update']);
});
test('duplicate IDs across categories fail', t => {
  const f = fixture(t); f.categories.push({ id: 'tools/cargo', group: '工具', title: 'Cargo' }); f.taxonomy(); f.write({ ...f.data, category: 'tools/cargo' });
  assert.throws(() => loadResources(f.root), /重复资源 ID/);
});
test('duplicate YAML keys fail', t => {
  const f = fixture(t), filename = f.write(); fs.writeFileSync(filename, fs.readFileSync(filename, 'utf8').replace('id: sample', 'id: sample\nid: other'));
  assert.throws(() => loadResources(f.root), /重复元数据字段/);
});
test('stray Markdown is validated', t => { const f = fixture(t); fs.writeFileSync(`${f.root}/resources/stray.md`, '# lost'); assert.throws(() => loadResources(f.root), /缺少 YAML/); });
test('normalized duplicate URLs fail', t => { const f = fixture(t); f.write({ ...f.data, id: 'other', url: 'http://EXAMPLE.org/sample/' }); assert.throws(() => loadResources(f.root), /重复资源主链接/); });
test('unknown categories fail', t => { const f = fixture(t); f.write({ ...f.data, id: 'other', category: 'libraries/missing' }); assert.throws(() => loadResources(f.root), /未知分类/); });
test('invalid status, URL, credentials and fields fail', t => {
  const f = fixture(t);
  for (const changes of [{ status: 'popular' }, { url: 'javascript:alert(1)' }, { url: 'https://user:password@example.org' }, { extra: 'x' }]) { f.write({ ...f.data, ...changes }); assert.throws(() => loadResources(f.root)); }
});
test('resource path must match metadata', t => { const f = fixture(t), filename = f.write(); fs.renameSync(filename, filename.replace('sample.md', 'renamed.md')); assert.throws(() => loadResources(f.root), /文件路径/); });
test('heading must match and be unique', t => { const f = fixture(t); for (const body of ['# Wrong\n\n介绍', '# Sample\n\n介绍\n\n# Second\n']) { f.write(f.data, body); assert.throws(() => loadResources(f.root)); } });
test('encoded local links and missing files', t => {
  const f = fixture(t), asset = `${f.root}/some image.png`; fs.writeFileSync(asset, ''); f.write(f.data, '# Sample\n\n![img](../../../some%20image.png)\n'); checkLocalLinks(f.root); fs.unlinkSync(asset); assert.throws(() => checkLocalLinks(f.root), /本地链接不存在/);
});
test('check detects stale generated output', t => { const f = fixture(t); main([], f.root); main(['--check'], f.root); fs.appendFileSync(`${f.root}/resources/readme.md`, 'stale'); assert.throws(() => main(['--check'], f.root), /导航需要重新生成/); });

test('navigation is expanded and preserves source star/license badges', t => {
  const f = fixture(t);
  const stars = '![stars](https://img.shields.io/github/stars/example/project?style=flat)';
  const license = '![GitHub](https://img.shields.io/github/license/example/project)';
  f.write(f.data, `# Sample\n\n${stars} ${license}\n\n介绍。\n\n${stars}\n`);
  const { categories, resources, badges } = loadResources(f.root);
  const generated = outputs(categories, resources, badges);
  const group = generated['resources/libraries/readme.md'];
  assert.match(group, /Star 数 \/ 开源协议/);
  assert.ok(group.includes(`${stars} ${license}`));
  assert.equal(group.split(stars).length - 1, 1);
  assert.match(group, /<a id="async"><\/a>/);
  for (const content of [group, generated['resources/readme.md']]) assert.doesNotMatch(content, /<details>|<summary>/);
  assert.deepEqual(JSON.parse(generated['resources/index.json'])[0], { ...f.data, path: 'resources/libraries/async/sample.md' });
});
