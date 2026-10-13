# 给 GitHub Agent 一个链接，生成介绍并收录

[返回首页](../readme.md) · [贡献规范](../CONTRIBUTING.md) · [工作流方案](github-workflow.md)

## 日常使用

配置发布到仓库默认分支并启用 Copilot cloud agent 后：

1. 新建 Issue，选择“给 Agent 一个链接，自动收录资源”，填写一个链接即可。
2. 维护者将 Issue 分配给 Copilot；分配界面支持 Agent 选择时选 `resource-curator`。使用默认 Copilot 也会通过仓库指令读取相同收录规则。
3. Agent 阅读官网或项目资料，检查是否已经收录，选择分类，撰写中文介绍，修改独立资源文件并生成目录。
4. Agent 创建以默认分支为目标的 PR，说明依据、资源 ID、分类和检查结果，并在正文自动填写 `Closes #编号`。维护者核对事实、批准必要的检查运行并审核合并；GitHub 随后自动关闭已完整完成的相关 Issue。

GitHub 官方支持通过分配 Issue 启动 cloud agent 并创建 PR，见[启动 Agent 任务](https://docs.github.com/en/copilot/how-tos/copilot-on-github/use-copilot-agents/kick-off-a-task)。提交 Issue 不等于已经分配任务或完成收录。

也可以在 GitHub Agents 界面选中本仓库和 `resource-curator` 后直接提交：

```text
请把 https://github.com/example/project 收录到 Rust Boom。
读取一手资料，生成中文介绍，自行选择已有分类；
如已经收录则保持原 ID 更新，运行目录校验并提交 PR。
```

示例链接需替换为真实链接。根据 GitHub 当前规则，直接用提示启动任务默认先生成分支；需要在界面要求创建 PR 或在完成后发起 PR。分配 Issue 的路径会直接创建 PR。

## 收录结果约定

用户无需预先填写名称、分类、ID 或文案。Agent 会生成这些字段，主链接选择稳定入口，正文包含用途、主要功能、适用场景、相关链接和实际读取的资料依据。

默认操作是 `auto`，同一资源已存在则更新，否则新增。指定 `add` 时不重复收录；指定 `update` 或已有 ID 时必须唯一定位，不把找不到的更新请求改成新增。官网与 GitHub 仓库是同一项目的不同入口时应复用已有条目。

生成介绍基于实际成功读取的资料，不编造无法验证的性能、维护状态、许可证或版本兼容性。访问失败或资料不足时说明缺失项，不创建虚构条目。正文核验日期只代表本次资料读取；维护状态仍需要独立依据。

## 仓库配置

| 文件 | 用途 |
| --- | --- |
| `.github/ISSUE_TEMPLATE/resource-link.yml` | 只有链接必填的入口，由目录脚本生成 |
| `.github/agents/resource-curator.agent.md` | 专门的收录 Agent，使用平台默认模型与可用工具 |
| `.github/copilot-instructions.md` | 默认 Copilot 也遵循相同目录与收录规则 |
| `.github/workflows/copilot-setup-steps.yml` | Agent 开始前准备 Node.js 和校验依赖 |
| `.github/workflows/catalog.yml` | PR 和 push 的目录一致性校验 |

Agent 配置格式依据 [GitHub 自定义 Agent 配置](https://docs.github.com/en/copilot/reference/custom-agents-configuration)。没有指定模型或外部模型服务密钥。Agent 通过运行环境中的 HTTP 客户端读取网页；GitHub cloud agent 的 `web` 工具别名当前不适用，因此配置没有依赖该别名。

环境准备工作流的 job 必须命名为 `copilot-setup-steps`，它在 Agent 执行前运行；这不表示普通 Actions 会自动启动 Agent。见[开发环境配置](https://docs.github.com/zh/copilot/how-tos/copilot-on-github/customize-copilot/customize-cloud-agent/customize-the-agent-environment)。

## 首次启用与验证

1. 将表单、Agent 指令、环境准备和目录校验配置合并到默认分支。
2. 确认账号具有适用的 Copilot 计划，且组织/仓库允许使用 cloud agent。检查 Issue 分配界面可以选择 Copilot，自定义 Agent 选择界面能找到 `resource-curator`。
3. 手工运行 Copilot Setup Steps，确认依赖安装成功。
4. 检查 Agent 的外网访问范围：GitHub 默认防火墙可能阻止资源官网。按所需公开网站配置允许访问的域名，遇到限制时保留失败说明。见 [Copilot 故障排查](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/cloud-agent/troubleshoot-cloud-agent)。
5. 检查 Settings → General → Issues 中 “Auto-close issues with merged linked pull requests” 已开启，确认 PR 正文包含真实关闭引用且目标为默认分支。
6. 用一个尚未收录的公开 Rust 项目链接测试，检查 Agent 实际读取的来源、生成文案、目录 diff、PR 检查、审核流程和合并后的 Issue 自动关闭；再用已收录项目的不同入口测试更新与去重。

目前本地已准备这些文件并完成目录检查，未验证远端 Copilot 计划、仓库开关、域名允许列表或真实 Agent 收录结果。后续若需提交链接后自动分派 Agent，再按[工作流方案](github-workflow.md)接入受控分派层。
