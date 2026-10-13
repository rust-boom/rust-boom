# AI 自动维护与自动交付

[返回首页](../readme.md) · [Agent 规范](../AGENTS.md) · [链接收录](github-agent.md)

## 项目初始化内容

`AGENTS.md` 是仓库共享规范，`.agents/skills/` 中提供两个项目技能：

| 技能 | 负责的能力 |
| --- | --- |
| `rust-boom-maintenance` | 从链接新增或更新资源，核验过时内容，查重分类并生成目录 |
| `rust-boom-delivery` | 校验后自动 Commit、Push 任务分支、创建或更新 PR |

项目规则明确授权后续 AI 任务在其范围内自动交付，无需每次再次询问提交、Push 或 PR。用户当次要求只分析或不提交时遵循当次要求。默认保留人工合并；完整解决的 Issue 通过 PR 正文的 `Closes #编号` 在合并后关闭。

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

本次已安装本机 `gh`，但未登录 GitHub；不自动发起登录或改动凭证。未来完成任务时如果仍未登录，交付会在 Git 修改前报告认证阻塞。

## GitHub 每周 AI 维护

已提供源工作流 `.github/workflows/maintain-resources.md`，并用 GitHub 官方 gh-aw **v0.89.21** 编译生成 `.github/workflows/maintain-resources.lock.yml`。提交时两者一起提交，生成文件不手改。格式与编译约定见 [GitHub Agentic Workflows](https://github.github.com/gh-aw/reference/workflow-structure/)。

默认每周一北京时间 **09:00**（UTC 01:00）运行，也可以从 Actions 手动执行。每次只核验最多 5 项既有资源，优先待核验且能通过 GitHub 一手资料核对的条目；按稳定 ID 和周序号循环选取，避免反复只巡检最前面的资源。没有实质更新时安静结束；已有未合并的 `[AI 维护]` PR 时暂缓新的修改。

AI 任务只允许输出资源 Markdown 与 JSON 索引的补丁，最多创建一个草稿 PR。源工作流设置 `safe-outputs.create-pull-request.allowed-files` 限制输出路径；禁止资源维护借机修改分类清单、指令、工作流、依赖和代码。GitHub 的安全输出层完成提交、分支推送和 PR 创建，AI 不运行本地交付脚本。

每次输出要附实际读取的资料和检查结果。维护者审核、合并后才对默认分支生效。定期任务不自动收录新资源；新增仍通过链接 Issue 或用户明确任务进入。

## 首次上线所需条件

- 配置已合并到默认分支，仓库 Actions 允许运行工作流及其编译锁文件中的官方 Actions。
- 组织支持 Copilot 推理与集中计费：本工作流使用 `copilot-requests: write`，通过 Actions token 推理，不需要额外模型 API Key。若组织不支持这条认证路径，需先按官方文档改为 PAT 方式并重新编译，不能同时保留该权限期待 PAT 自动回退。见 [gh-aw 认证](https://github.github.com/gh-aw/reference/auth/)。
- 仓库允许 Actions 创建 PR，PR 校验需要审批时由维护者批准；如果需要自动触发后续 CI，再按官方触发规则配置最小权限凭证。
- 先手动运行一次，核对 Agent 真实读取的资料、生成文案、diff、校验和草稿 PR，再确认每周计划运行。

本地编译成功不代表这些条件已满足。本次没有核验远端 Copilot 计划、Actions 开关或实际推理与 PR 结果。

## 修改与验证

更新工作流 front matter、指令或编译器后重新编译，使用固定版本保证可追溯：

```sh
gh extension install github/gh-aw --pin v0.89.21
gh aw compile maintain-resources --no-check-update
npm ci
npm run check
npm test
```

交付测试使用临时仓库、临时 bare remote 和模拟 gh，不操作真实远端。技能 front matter 的格式检查不能代替实际 GitHub 运行验证。
