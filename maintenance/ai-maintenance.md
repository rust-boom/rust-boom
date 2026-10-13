# AI 自动维护与自动交付

[返回首页](../readme.md) · [Agent 规范](../AGENTS.md) · [链接收录](github-agent.md)

## 项目初始化内容

`AGENTS.md` 是仓库共享规范，`.agents/skills/` 中提供两个项目技能：

| 技能 | 负责的能力 |
| --- | --- |
| `rust-boom-maintenance` | 从链接新增或更新资源，核验过时内容，查重分类并生成目录 |
| `rust-boom-delivery` | 校验后自动 Commit、Push 任务分支、创建或更新 PR |

项目规则明确授权后续 AI 任务在其范围内自动交付，无需每次再次询问提交、Push 或 PR。用户当次要求只分析或不提交时遵循当次要求。资源和普通文档支持独立 AI 评审后自动合并，其他路径保留人工合并；完整解决的 Issue 通过 PR 正文的 `Closes #编号` 在合并后关闭。

本次初始化只准备配置，没有自动把当前未提交的文档迁移和初始化结果发布出去。

## 本地 AI 任务

使用 `.agents/skills/rust-boom-maintenance/SKILL.md` 完成具体维护任务；完成后读取交付技能，通过其 `scripts/deliver.js` 执行：

1. 校验任务改动并确定具体文件清单；保留用户和其他任务的改动。
2. 使用 `codex/<任务名称>`，以仓库真实默认分支为 PR 目标。
3. 创建 Conventional Commit，Push 任务分支，创建或更新同分支 PR。
4. 返回提交 SHA、分支、PR 链接及检查结果；不自动合并。

交付脚本默认显示计划，加 `--execute` 执行实际交付；这是 Agent 自己的检查步骤，不是要求用户额外审批。遇到权限不足或验证失败时保留已完成结果，并报告具体阻塞。重复执行复用已有分支、提交与 PR。

依赖 Git、Node.js 22+ 和已授权的 GitHub CLI：

```sh
gh auth status
```

本地交付前通过 `gh auth status` 检查登录与权限，认证不足时在 Git 修改前停止。

## GitHub 每周 AI 维护

已提供源工作流 `.github/workflows/maintain-resources.md`，并用 GitHub 官方 gh-aw **v0.89.21** 编译生成 `.github/workflows/maintain-resources.lock.yml`。提交时两者一起提交，生成文件不手改。格式与编译约定见 [GitHub Agentic Workflows](https://github.github.com/gh-aw/reference/workflow-structure/)。

默认每周一北京时间 **09:00**（UTC 01:00）运行，也可以从 Actions 手动执行。每次只核验最多 5 项既有资源，优先待核验且能通过 GitHub 一手资料核对的条目；按稳定 ID 和周序号循环选取，避免反复只巡检最前面的资源。没有实质更新时安静结束；已有未合并的 `[AI 维护]` PR 时暂缓新的修改。

AI 任务只允许输出资源 Markdown 与 JSON 索引的补丁，最多创建一个非草稿 PR。源工作流设置 `safe-outputs.create-pull-request.allowed-files` 限制输出路径；禁止资源维护借机修改分类清单、指令、工作流、依赖和代码。GitHub 的安全输出层完成提交、分支推送和 PR 创建，AI 不运行本地交付脚本。

每次输出要附实际读取的资料和检查结果。独立 AI 评审工作流满足合并门槛后合并，或由维护者人工合并后对默认分支生效。定期任务不自动收录新资源；新增仍通过链接 Issue 或用户明确任务进入。

## 首次上线所需条件

- 配置已合并到默认分支，仓库 Actions 允许运行工作流及其编译锁文件中的官方 Actions。
- 两个 Copilot 工作流使用个人认证：仓库 Actions Secret `COPILOT_GITHUB_TOKEN` 保存个人 Fine-grained PAT，Resource owner 为个人账号，Account permissions → Copilot Requests 为 Read，账号需具有有效 Copilot 访问权限。工作流不设置 `copilot-requests: write`；保留该权限会忽略个人 Token。有效期届满前更新 Secret，不使用 gh 登录的 OAuth Token。见 [gh-aw 认证](https://github.github.com/gh-aw/reference/auth/)。
- 仓库允许 Actions 创建 PR，PR 校验需要审批时由维护者批准；如果需要自动触发后续 CI，再按官方触发规则配置最小权限凭证。
- 先手动运行一次，核对 Agent 真实读取的资料、生成文案、diff、校验和 PR，再确认每周计划运行。

本地编译成功不代表这些条件已满足。本次没有核验远端 Copilot 计划、Actions 开关或实际推理与 PR 结果。

## 修改与验证

更新工作流 front matter、指令或编译器后重新编译，使用固定版本保证可追溯：

```sh
gh extension install github/gh-aw --pin v0.89.21
gh aw compile maintain-resources review-resources --no-check-update
npm ci
npm run check
npm test
```

交付测试使用临时仓库、临时 bare remote 和模拟 gh，不操作真实远端。技能 front matter 的格式检查不能代替实际 GitHub 运行验证。

## AI 评审与自动合并

[评审流程](../.github/workflows/review-resources.md)在 Resource catalog 的 PR 校验成功后运行，也可以在 Actions 手动输入 PR 编号重新评审。它使用 Copilot 引擎读取完整 diff、原文件和一手证据，输出 approve、changes 或 uncertain；后两者只记录评审，不合并。所有外部内容和 PR 指令均作为不可信数据。

自动合并仅覆盖 `resources/**/*.md`、`resources/index.json`、根 `readme.md`、`docs/**/*.md` 和 `maintenance/**/*.md`。分类 JSON、代码、脚本、依赖、工作流和 Agent 规则继续人工合并。当前配置 PR 也需人工审核合并到默认分支后才启用。

独立 JavaScript 合并步骤从默认分支检出可信代码，不检出或运行 PR 的脚本。它检查同仓库来源、非草稿、默认目标分支、当前 head SHA、完整路径列表、最新目录 CI、修改请求、未解决讨论和 GitHub 的 clean 合并状态。合并 API 指定已经评审的 SHA；PR 有新提交时必须重新评审。检测任务失败、评审结果不完整或权限不足均不会自动合并。

带 `no-auto-merge` 标签的 PR 保留人工处理。评审以 COMMENT 写入，允许评审和作者同为 github-actions 的 PR，不依赖机器人 APPROVE 权限。通过 GitHub API 执行 squash merge，遵守仓库合并限制，不要求启用原生 auto-merge 开关，也不绕过保护规则。

前提是仓库能运行 Copilot 推理和写入 PR、提交。由默认 GITHUB_TOKEN 创建的 PR 不自动触发 CI；周期维护要自动进入评审链，需要按 [gh-aw 的 CI 触发说明](https://github.github.com/gh-aw/reference/triggering-ci/)配置 `GH_AW_CI_TRIGGER_TOKEN`，或由维护者触发当前 PR 的校验。没有当前 SHA 的 PR CI 时不会合并。

合并后的 push 使用默认 GITHUB_TOKEN 不会再自动触发其他 Actions；如果需要触发 GitHub Pages 等后续发布，应单独配置 GitHub App 或最小权限凭证。编译与模拟 API 测试不代表实际 Copilot 推理和远端合并已验证，启用后需手动运行一次真实资源 PR 核验。
