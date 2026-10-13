# Issue → 工作流 → PR 接入方案

[贡献规范](../CONTRIBUTING.md) · [目录约定](structure.md)

## 当前已具备的基础

统一资源字段与稳定 ID、分类清单、两种 Issue 表单、目录生成器、PR 模板和只读 PR 校验工作流。还准备了 `resource-curator` 自定义 Agent、默认 Copilot 指令与环境准备工作流。配置发布到默认分支、仓库启用 Copilot 后，可通过原生 Issue 分配执行链接收录，详见[Agent 收录指南](github-agent.md)。仓库远端是否已启用该能力尚未验证。

## 两种输入方式

| 入口 | 用户填写 | 谁生成介绍 | 执行方式 |
| --- | --- | --- | --- |
| 链接收录表单 | 必填一个链接；其他字段可选 | GitHub Agent 读取资料后撰写 | 原生分配 Issue 给 Copilot；后续可自动分派 |
| 完整字段表单 | ID、名称、分类、链接、状态、正文、依据 | 用户或维护者 | 人工提交 PR；后续确定性写入工作流 |

链接入口允许 Agent 生成缺失的 ID、名称、分类和介绍；完整字段入口对用户已明确填写的内容按字段校验后写入。两种方式都必须经过同一目录校验和 PR 审核。重复资源通过已有 ID 更新。

## 链接 → Agent → PR

用户提交链接 → 维护者分配 Issue 给 `resource-curator` / Copilot → Agent 读取一手资料 → 查重并定位资源 → 生成中文介绍与资料依据 → 更新源文件和生成目录 → 执行校验 → 创建 PR → 人工审核合并。

这条路径的 PR 创建由 GitHub 原生 Agent 承担，不需要先实现自行调用模型或自行创建 PR 的 Actions。环境准备工作流只安装 Node.js 依赖，不读取链接、不自动分配 Issue。

若后续希望“提交链接即自动启动”，增加受维护者控制的触发与分派层即可。可以用 GitHub Agentic Workflows 的 `assign-to-agent` 等官方能力；接入时核对其 token 权限要求，不能假设普通 `GITHUB_TOKEN` 就能调用 Agent。见 [Copilot 分派能力与认证](https://github.github.com/gh-aw/reference/assign-to-copilot/)。这条 Issue 自动分派层尚未编写或启用；已准备的每周资源维护工作流是独立入口，见[AI 自动维护](ai-maintenance.md)。

## 完整字段 → 确定性写入工作流（后续实现）

1. 用户提交资源 Issue，操作为 `add` 或 `update`，包含完整资源信息。
2. 维护者审核收录依据并添加 `resource-approved` 标签；或由维护者使用 `workflow_dispatch` 指定 Issue 编号。
3. 工作流读取 Issue 最新正文，解析并校验字段，通过 ID 定位 `resources/index.json` 中的现有资源。
4. `add` 必须使用不存在的 ID 和主链接；`update` 必须匹配已存在的 ID。依据分类清单确定路径，分类变更时移走旧文件，保持 ID 不变。
5. 更新源 Markdown，生成导航、JSON 索引和表单，执行同一套校验与测试。
6. 在 `codex/resource-issue-<编号>` 分支提交变更，创建或更新以默认分支为目标的 PR；PR 中记录本次处理的 Issue 更新时间和正文摘要，并在正文填写真实的 `Closes #<编号>`。
7. 维护者审查 PR 并合并到默认分支，由 GitHub 自动关闭该 PR 完整解决的 Issue。

介绍字段是完整替换内容；标题由元数据生成，不让 Issue 直接指定任意文件路径。状态变更需要核验依据。若 Issue 自审核后被编辑，先重新审核，避免旧标签批准新内容。失败时在 Issue 返回具体字段错误，不留下部分资源修改。

## 合并后自动关闭 Issue

两种收录路径均使用 GitHub 原生的合并关闭机制。来自 Issue 的 PR 在普通正文写入真实关闭引用，例如：

```text
Closes #123
Closes #456
```

示例编号必须替换为本 PR 已完整完成的真实 Issue 编号；只参考或部分完成的请求使用 `Refs #编号`。跨仓库引用写为 `Closes owner/repo#编号`。Agent 创建或更新 PR 时自动填写并保留这些引用，维护者在审核时核对。

PR 必须以仓库默认分支为目标，并最终合并到默认分支；只创建 PR、关闭未合并的 PR、合并到其他分支都不会通过此机制关闭 Issue。参见 [GitHub Issue 与 PR 关联规则](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/linking-a-pull-request-to-an-issue)。

首次启用时检查 Settings → General → Issues 的 “Auto-close issues with merged linked pull requests” 已开启。GitHub 默认开启，但仓库维护者可以关闭，因此不能仅凭默认值判断远端实际状态。参见[自动关闭设置](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/managing-repository-settings/managing-auto-closing-issues)。当前未核验该仓库的远端开关。

## 幂等与并发

自行实现的写入/分派层以仓库和 Issue 编号为工作流 concurrency key；同一 Issue 使用固定分支或已有 Agent 会话和唯一 PR，重跑更新现有 PR。GitHub 原生 Agent 使用平台管理的分支，不强制改为 `codex/`。分支从最新默认分支构建，比较目标资源是否已变化，有冲突时交给维护者处理。自动工作流不覆盖 PR 中额外的人工修改；检测到额外修改就停止并说明原因。不同 Issue 涉及同一资源时，后续 PR 合并前重新生成并校验。

## GitHub 权限与触发

写入任务按需授予 `contents: write`、`pull-requests: write`，只有需要回复 Issue 的任务才授予 `issues: write`。仓库或组织必须允许 Actions 创建 PR；该设置与 token 权限分别检查。见 [GitHub 仓库 Actions 设置](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/enabling-features-for-your-repository/managing-github-actions-settings-for-a-repository)。

依据 GitHub 当前文档，使用 `GITHUB_TOKEN` 创建或更新 PR 所触发的部分 `pull_request` 检查会进入需要审批的状态。因此生成任务自身必须先执行校验；若要自动运行后续 PR 检查，可使用具有所需权限的 GitHub App installation token。接入时再次核对 [GITHUB_TOKEN](https://docs.github.com/en/actions/concepts/security/github_token) 和[工作流触发规则](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/trigger-a-workflow)。

将 Issue 正文作为数据经 JSON/API 读取并安全序列化，不拼入 shell 命令。写入工作流只运行默认分支上的可信脚本。普通 PR 校验使用 `pull_request` 与 `contents: read`。

## 接入验收

至少验证：新增资源、更新介绍、变更分类、停止更新标记、重复 ID/链接、未知 ID/分类、非法链接、缺少字段、重复触发、审核后修改 Issue、人工修改过的 PR、同资源并发，以及默认分支更新后的重新生成。Agent 路径还需验证仅链接输入、官网与仓库两个入口指向同一资源、外部网站不可访问、资料不足和生成文案的事实核验。最后在测试仓库验证真实 Issue → Agent/写入任务 → 分支 → PR → 校验 → 审核合并 → 索引更新 → 自动关闭 Issue 全过程；还需确认未合并 PR 和仅 `Refs` 的 Issue 保持打开，再在正式仓库启用自动写入。
