---
id: "rpi"
title: "rpi"
category: "libraries/automation"
url: "https://github.com/bigfish1913/pi-rust"
status: "active"
---

# rpi

![stars](https://img.shields.io/github/stars/bigfish1913/pi-rust?style=flat) ![GitHub](https://img.shields.io/github/license/bigfish1913/pi-rust)

rpi 是以库为核心的 Rust 编程 Agent 运行时，同时提供基于这些库构建的终端工具。它将模型适配、Agent 循环、工具执行和会话管理拆成可组合的 crate，适合将代码读写与命令执行能力接入自己的 Rust 应用或自动化流程。

项目起源于对 Mario Zechner 的 Pi TypeScript SDK 的 Rust 重实现，现已独立演进；不是 Pi 官方发行版，也不代表与 Pi 的配置、会话或扩展完全兼容。

## 功能与适用场景

- 使用 `rpi-agent`、`rpi-ai` 等库在进程内运行流式 Agent，订阅事件并接入自定义工具；无需通过解析终端输出集成。
- 提供文件读取、写入、编辑和命令执行等工具，可直接使用 `rpi` 终端 Agent，也可组合到自己的工作流中。
- 提供 JSONL 会话持久化、分支、上下文压缩和崩溃恢复。恢复能力不等于对任意外部副作用提供恰好一次执行保证。
- 通过带版本协商的原生插件 ABI 扩展工具和模型 Provider。
- 内置确定性的 faux provider，便于在没有 API Key 和网络推理的情况下运行示例与测试。

## 上手路径

直接使用 CLI 可安装 `rpi-cli`，随后按项目文档配置模型凭据或兼容接口。实际模型推理依赖用户选择的服务及其费用规则。

希望了解嵌入方式，可在项目源码中运行 `cargo run -p minimal`；该示例使用 faux provider，不需要 API Key。它用于演示 Agent 循环，不是离线代码生成模型。

## 相关链接

- [代码仓库与安装说明](https://github.com/bigfish1913/pi-rust)
- [最小嵌入示例](https://github.com/bigfish1913/pi-rust/tree/main/examples/minimal)
- [rpi-agent crate](https://crates.io/crates/rpi-agent)
- [rpi-harness：会话与恢复层](https://github.com/bigfish1913/pi-rust/tree/main/crates/rpi-harness)

## 资料核验

- 核验日期：2026-10-18。
- 已读取项目官方 README，并核对公开发布记录及默认分支维护活动。2026-10-18 发布 v0.5.1，默认分支同日有公开提交，因此标记为 active。
- [官方 README](https://github.com/bigfish1913/pi-rust/blob/main/README.md)
- [v0.5.1 发布记录](https://github.com/bigfish1913/pi-rust/releases/tag/v0.5.1)
- [维护提交（2026-10-18，UTC）](https://github.com/bigfish1913/pi-rust/commit/cf38bf0e2b5a85e8483e42dda0b7e22825f55783)
