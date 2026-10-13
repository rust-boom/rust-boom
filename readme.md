<div align="center">
  <p><img src="./photo/flux-rust5.jpg" alt="Rust Boom" /></p>
  <p><img src="https://img.shields.io/github/last-commit/rust-boom/rust-boom?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0%E6%97%B6%E9%97%B4&style=for-the-badge" alt="最后更新时间" /></p>
</div>

# Rust Boom 💥

整理 Rust 学习资料、开发工具、开发库与框架、成品应用，以及学习中的问题和解决方法，帮助 Rust 初学者查找适合自己的资源。

## 资源导航

<details>
<summary><strong>展开资源分类</strong></summary>

| 分类 | 内容 |
| --- | --- |
| [学习资料](resources/learning/readme.md) | 文章与刊报、视频课程、书籍与系统教程 |
| [开发工具](resources/tools/readme.md) | 编辑环境、Cargo 扩展、前端工具与运行时 |
| [开发库与框架](resources/libraries/readme.md) | GUI、Web、异步、数据库访问、图形、多媒体、FFI 等 |
| [成品应用](resources/applications/readme.md) | 编辑器、终端、数据库服务、搜索、系统工具等 |
| [社区与动态](resources/community/readme.md) | 社区论坛、历史新闻与事件 |
| [全部分类](resources/readme.md) | 分类清单与资源数量 |

</details>

每项资源都有稳定 ID 和独立介绍页。历史资源的维护状态默认“待核验”；原文明确标记停止更新的资源保留该标记。收录与迁移不代表已核验外部链接、项目现状或介绍中的时效性信息。

## 本仓库教程与示例

[教程目录](docs/readme.md)收录本仓库文章及其 Rust 示例。学习资料中的外部文章与本仓库教程分别维护。

- [Move、Copy、Clone](docs/s1_move_copy_clone/readme.md)
- [方法重载模式](docs/s2_overload/readme.md)
- [多态与 dyn Trait](docs/s3_dyn_trait/readme.md)

## 参与维护

只想提供一个链接，可以使用“给 Agent 一个链接，自动收录资源”Issue 表单。维护者将 Issue 分配给 Copilot 后，`resource-curator` Agent 会读取资料、查重、分类、生成中文介绍并提交 PR。配置发布到默认分支并启用 Copilot 后可使用，具体见[Agent 收录指南](maintenance/github-agent.md)。

也可以使用“添加或更新 Rust 资源”Issue 表单手工填写完整信息，或者按照[贡献规范](CONTRIBUTING.md)直接提交 PR。资源经过审核合并后进入目录。

PR 校验会检查资源元数据、分类、重复 ID/主链接、本地文件链接，以及生成目录是否一致。后续自动分派 Agent 和完整字段自动写入的设计见[GitHub 工作流接入方案](maintenance/github-workflow.md)。

## 关于仓库

- [目录与分类约定](maintenance/structure.md)
- [AI 自动维护与交付](maintenance/ai-maintenance.md)
- [致谢与素材来源](maintenance/credits.md)
- [插图](photo/readme.md)
- [MIT License](LICENSE)
