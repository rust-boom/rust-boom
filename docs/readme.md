# 本仓库教程与示例

[返回首页](../readme.md) · [外部学习资料](../resources/learning/readme.md)

这里保存本仓库编写或整理的教程和配套代码。每个 `s*` 目录保持为独立 Rust workspace 成员；资源目录和维护文档不放入这些目录。

| 主题 | 文档 | 示例目录 | 完成情况 |
| --- | --- | --- | --- |
| WebAssembly 资料整理 | [没有 Bundler 的 Rust 和 WebAssembly](s0_collect_docs/没有%20Bundler%20的%20Rust%20和%20WebAssembly.md) | `s0_collect_docs/src/` | 已有文档与示例 |
| 所有权转移与复制 | [Move、Copy、Clone](s1_move_copy_clone/readme.md) | `s1_move_copy_clone/src/` | 已有文档与示例 |
| 方法重载 | [方法重载模式](s2_overload/readme.md) | `s2_overload/src/` | 已有文档与示例 |
| 多态 | [dyn Trait](s3_dyn_trait/readme.md) | `s3_dyn_trait/src/` | 已有文档与示例 |
| 所有权 | [所有权笔记](s4_ownership/readme.md) | `s4_ownership/src/` | 文档仍在编辑中 |

教程中的代码可能用于展示编译错误。资源 PR 的目录校验与 Rust 示例编译是两个独立检查，不用全 workspace 编译作为资源收录条件。
