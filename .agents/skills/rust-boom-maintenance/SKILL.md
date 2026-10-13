---
name: rust-boom-maintenance
description: "维护 Rust Boom 资源目录：从链接新增或更新资源、核验过时介绍、查重分类并生成导航；适用于收录任务与定期 AI 巡检。"
---

# Rust Boom 资源维护

读取根 `AGENTS.md`、`CONTRIBUTING.md`；链接收录与事实核验遵循 `.github/agents/resource-curator.agent.md` 的完整规则。分类选择参考 `resources/categories.json`，使用 `resources/index.json` 定位已有 ID，再读取源 Markdown。

## 任务选择

用户给一个链接时，读取一手资料，自行补全名称、ID、分类和介绍；已有同一项目则保留 ID 更新。用户指定新增、更新或 ID 时尊重其选择，不把失败更新变成新增。身份无法唯一确认时说明候选项。

定期巡检时优先处理既有资源中待核验或明显过时的内容，每次最多 5 项。先检查是否已有未合并的 AI 维护 PR，存在则等待审核，避免重复。不是每次巡检都需要修改；只有新证据带来实质更新才交付 PR，不用单纯更新日期制造改动。

当前证据必须来自实际成功读取的官方 README、官网、文档或发布信息。记录资料 URL 和核验日期，无法证实的字段保持原值或 unknown；网页可访问不代表 active。暂时请求失败不代表 archived，不据此删除资源。

## 写入与交付

只改任务涉及的资源与派生目录，保持稳定 ID、有效补充链接、直接展开的导航和原有 Star/开源协议徽章。不要借资源维护扩大到分类体系、代码、依赖、工作流、Agent 指令或技能。

运行目录生成、`--check` 与现有测试，见 `AGENTS.md` 的命令。生成的两个 Issue 表单如果未变化无需提交。

本地任务使用 `.agents/skills/rust-boom-delivery/SKILL.md` 自动提交、Push 和创建/更新 PR。GitHub 原生 Agent 使用其 PR 交付方式；Agentic Workflow 使用配置中的 safe-outputs，不调用本地交付脚本。

PR 包含具体更新点、资源 ID、分类、实际读取的证据和检查结果；只有完整完成 Issue 的改动才用 Closes 关联。报告实际交付状态，未合并不宣称默认分支已更新。
