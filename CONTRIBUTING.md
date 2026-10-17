# 贡献指南

[返回首页](readme.md) · [分类清单](resources/readme.md) · [目录约定](maintenance/structure.md)

## 通过 Issue 推荐或更新资源

### 只提供链接，让 Agent 生成介绍

1. 使用“给 Agent 一个链接，自动收录资源”表单，只需填写资源链接；操作偏好、已有 ID 和补充要求均可留空。
2. 维护者将 Issue 分配给 Copilot，并选择 `resource-curator` Agent（如可用）。默认 Copilot 也会读取本仓库的收录指令。
3. Agent 读取公开资料、检查已有资源、选择分类、生成中文介绍并提交 PR。默认自动判断新增或更新；明确要求 `add` 时发现重复会说明已有资源，明确要求 `update` 时找不到资源会请求澄清。
4. 批准所需检查运行；独立 AI 评审无问题且 CI、合并检查通过后可自动合并。问题或证据不足时保留 PR，由维护者处理。

链接提交本身不触发 Agent。需先将配置发布到默认分支并在 GitHub 开通相应能力，见[Agent 收录指南](maintenance/github-agent.md)。

### 手工填写完整信息

1. 搜索资源目录，确认没有相同项目或主链接。
2. 选择“添加或更新 Rust 资源”表单，填写操作、稳定 ID、名称、分类、主链接、状态、完整介绍和依据。
3. 更新时沿用原 ID，提交完整的新版本内容。分类变更也沿用 ID。
4. 维护者提交关联该 Issue 的 PR，校验与独立 AI 评审通过后按自动合并规则生效，或人工审核合并。

完整字段的确定性写入工作流以及自动分派 Agent 的工作流尚未接入。GitHub 原生 Agent 可在分配 Issue 后自行生成 PR；两条路径的边界见[方案](maintenance/github-workflow.md)。

## 直接提交资源 PR

资源源文件位于 `resources/<分类组>/<分类>/<id>.md`。例如 `resources/libraries/async/libraries-async-001.md`。先在 `resources/categories.json` 选择已有分类；新增分类要说明用途和与已有分类的区别。

文件使用 YAML front matter，五个字段均为必填字符串；下方只有一个一级标题，并与 `title` 一致：

```markdown
---
id: "example-crate"
title: "Example Crate"
category: "libraries/async"
url: "https://example.org/example-crate"
status: "unknown"
---

# Example Crate

说明用途、适用场景及推荐理由。

- [代码仓库](https://example.org/example-crate)
```

ID 使用小写字母、数字和短横线，全仓库唯一。一旦收录，不因名称、分类或排序变化而修改；迁移文件时使用原 ID。主链接选官网、文档或代码仓库的稳定入口，全仓库不得重复。补充链接可以出现在正文中。

目录状态文案：`unknown` 显示“待确认”，表示维护状态尚未确认；`active` 显示“维护中”；`archived` 显示“已停止”，表示所链接的项目或历史仓库已停止维护。变更状态时在 PR/Issue 中提供核验日期和证据。迁移保留的历史 `archived` 标记尚未重新核验。临时“新收录”图标不作为长期状态。

修改资源后，在仓库根目录执行（Node.js 22 或以上）：

```sh
npm ci
npm run catalog
npm run check
npm test
```

生成的 `resources/readme.md`、各分类组的 `readme.md`、`resources/index.json` 和两个 Issue 表单需要一并提交，不手工修改。`index.json` 是供工作流和 Agent 读取的索引，资源正文与 front matter 才是内容来源。

PR 说明填写新增/更新原因。对已完整完成的 Issue，在 PR 正文填写 `Closes #123`；多个 Issue 每项各写一行，跨仓库使用 `Closes owner/repo#123`。PR 合并到仓库默认分支后由 GitHub 自动关闭对应 Issue；仓库 Settings → General → Issues 中的 “Auto-close issues with merged linked pull requests” 必须开启。仅引用或部分完成的请求使用 `Refs #123`，保持 Issue 打开。不要在提交 PR 时提前关闭 Issue。详细约定见[工作流方案](maintenance/github-workflow.md)。

审核重点是分类是否恰当、介绍是否准确、链接与状态依据是否有效。校验脚本不向外网请求，也不判断项目质量。

资源和普通文档的自动合并规则见 [AI 维护说明](maintenance/ai-maintenance.md#ai-评审与自动合并)。要保留人工合并，可保持草稿或添加 `no-auto-merge` 标签。脚本、依赖、工作流和 Agent 规则的 PR 必须人工合并。

资源新增或更新时，PR 会逐项检查本次变更的 GitHub 主仓库及 Star/协议徽章是否一致，并上传 `resource-verification` 报告。仓库迁移、未知 SPDX、非 GitHub 主链接等情况仍需核对实际一手资料；自动检查成功不代表介绍或维护状态已核验。GitHub API 请求失败会阻塞这次核验，可在权限/网络恢复后重跑，不据此删除资源或标记停止更新。
