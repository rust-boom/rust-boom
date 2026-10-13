# 目录与分类约定

[返回首页](../readme.md) · [贡献规范](../CONTRIBUTING.md)

## 文档层级

| 路径 | 职责 | 维护方式 |
| --- | --- | --- |
| `readme.md` | 首页与主要入口 | 人工维护 |
| `resources/categories.json` | 分类 ID、中文名称、分类组与说明 | 人工维护 |
| `resources/<组>/<分类>/<id>.md` | 单项资源元数据和完整介绍 | 人工或后续 Issue 工作流更新 |
| `resources/readme.md`、`resources/<组>/readme.md` | 分类导航 | 脚本生成 |
| `resources/index.json` | 工作流可读取的全量索引 | 脚本生成 |
| `docs/s*/` | 本仓库教程与配套 Rust 项目 | 人工维护 |
| `maintenance/` | 结构约定、流程方案、致谢 | 人工维护 |
| `AGENTS.md` | 全仓库 AI 规则与后续任务的自动交付授权 | 人工维护 |
| `.agents/skills/` | 项目维护与本地提交、Push、PR 技能 | 人工维护 |
| `books/` | 历史本地电子书文件 | 保留原路径；外部书籍推荐归入学习资料 |
| `photo/`、`readme.assets/` | 图片素材 | 保留原路径 |
| `play/`、`src/` | 实验代码与根项目 | 按原 Rust 项目维护 |
| `scripts/check/` | 资源校验与导航生成 | JavaScript 脚本；通过 npm 命令调用 |
| `.github/ISSUE_TEMPLATE/` | 完整字段表单与只需链接的 Agent 表单 | 脚本生成 |
| `.github/agents/resource-curator.agent.md` | 资源收录专用 GitHub Agent | 人工维护，约定读取资料、文案、更新与交付规则 |
| `.github/copilot-instructions.md` | 默认 Copilot 的仓库指令 | 人工维护，资源任务复用专用 Agent 的规则 |
| `.github/workflows/` | PR 校验、Copilot 环境准备、每周 AI 资源维护 | 普通 YAML 人工维护；Agentic Markdown 通过 gh-aw 编译成 lock.yml |
| `.github/pull_request_template.md` | PR 说明模板 | 人工维护 |

资源导航最多使用“分类组 → 用途分类 → 资源”三层结构。首页的分类入口、全部资源页的分类组和各分类组页面的用途分类均直接展开，使用标题和表格导航。标题仅显示分类名称，各用途分类保留稳定锚点；资源数量保留在导航统计表中。资源导航表从源资源正文提取原有 Star 数和开源协议徽章，不编造当前数值或协议类型。介绍页的一级标题是资源名称，详细介绍按需要使用二级及以下标题。

## 分类边界

优先按读者的使用目标确定唯一主分类，不按实现语言、热度或临时状态建立分类。

- 学习资料：文章、视频、书籍和系统教程。
- 开发工具：辅助编写、构建、调试代码的工具。
- 开发库与框架：在开发项目中作为依赖或集成组件使用；数据库访问库归入这里。
- 成品应用：用户可以直接运行的产品或服务；数据库服务、日志采集服务归入这里。
- 社区与动态：讨论社区和历史事件。

例如：SeaORM 是数据库访问库，cnosdb 是数据库服务；Polars 属于数据分析；AppFlowy 属于笔记与协作。前端构建工具与前端集成库分别归类。一个资源只保存一份正文，其他用途可在介绍中说明。

## 迁移与兼容性

此次从根 README 迁移 171 项资源，保留原介绍、补充链接、徽章与图片；修正迁移页面中的本地图片相对路径。维护状态默认待核验，保留原有停止更新标记，不把历史介绍当作当前事实。

旧 README 的资源标题锚点随拆分而变化，外部引用需要改为独立资源文件链接。教程、素材与代码原有路径保留。稳定 ID 为后续更新提供定位依据，但分类迁移后页面路径仍会改变，更新 PR 需同步仓库内引用；如将来要求永久公开 URL，可增加按 ID 路由的展示层。

分类调整后重新生成索引与表单。Cargo workspace 只包含 `docs/*` 和 `play/*`；`scripts/` 专用于 JavaScript 自动化，不作为 Rust crate。新增 Rust 项目时检查 workspace 配置。
