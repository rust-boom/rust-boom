---
name: rust-boom-delivery
description: "按 Rust Boom 规范自动提交当前任务改动、Push 任务分支并创建或更新 GitHub PR；用于本地 AI 任务完成后的交付，不合并 PR。"
---

# Rust Boom 自动交付

按根 `AGENTS.md` 的持续授权执行，不重复询问 commit、Push 或创建 PR。用户当次的范围限制优先。本次初始化只准备能力，后续实际任务才自动使用。

## 交付前

- 检查工作区、已暂存 diff 与当前任务 diff，明确任务拥有的文件清单。保留无关改动；禁止 git add .、自动 stash/reset 或 force push。
- 完成当前任务的必要校验。资源变更先生成导航，再运行目录校验和测试；失败先修复。其他变更运行与其风险相称的检查，不伪造资源校验能覆盖 Rust 代码或工作流运行。
- 读取 origin 和仓库实际默认分支，使用唯一 codex/<task> 分支；不要默认 Push 当前 master/main/develop。用户已有任务分支可复用；不把历史中无关提交塞进新 PR。
- 为任务准备 Conventional Commit、PR 标题和正文。更新已有 PR 前读取当前正文，保留仍有效的关闭引用和人工补充，再形成完整的新正文；不能用模板覆盖尚未读过的 PR。PR 正文写具体结果、验证边界和真实 Closes 引用；无需 Issue 的任务不编造关联。

## 执行

需要 Git、Node.js 22+、gh，且 gh 已登录并有仓库权限。使用 `scripts/deliver.js` 可复用确定性步骤：

```sh
node .agents/skills/rust-boom-delivery/scripts/deliver.js \
  --branch codex/update-resource \
  --message 'docs: update resource description' \
  --title '更新资源介绍' \
  --body-file /tmp/rust-boom-pr-body.md \
  --files resources/libraries/async/libraries-async-001.md resources/libraries/readme.md resources/index.json
```

第一次调用只检查并显示计划；检查计划确认路径属于任务、验证已通过后，加 `--execute` 执行。不需要再向用户请求批准。文件清单使用具体文件，分类移动同时包含删除的旧文件与新文件。脚本不代替 Agent 的 diff 审查和业务校验。

脚本依次创建/复用任务分支、暂存指定路径、提交、Push 和创建/更新同分支唯一 PR。重复调用没有新改动时复用已有提交和 PR；失败报告已完成步骤，不反复创建提交或 PR。远端失败后可重跑同一分支，禁止回滚用户工作区或自动改用更高权限凭证。

## 结果

记录 commit SHA、Push 分支、PR URL 和验证结果；在支持的 Codex 环境调用 attach_artifact 附加创建或更新的 PR。然后读取 PR/CI 状态，明确检查已通过、运行中或失败，不自动合并。

GitHub 原生 Agent / Agentic Workflow 不使用本脚本，它们通过平台管理的分支和 PR 或 safe-outputs 完成交付，参见 `maintenance/ai-maintenance.md`。
