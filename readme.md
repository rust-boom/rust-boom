![img](https://rustacean.net/more-crabby-things/rustdocs.png)

# Rust Boom 💥

Rust Boom 是一个我在学习使用 Rust 的时候，对 Rust 的一些难点的解决方法以及一些 Rust 开源的好玩的库、书籍、文章的整理，希望可以帮助更多的 Rust 初学者来翻过 Rust 这座大山。

## TOC

- [Rust Boom 💥](#rust-boom-)
  - [TOC](#toc)
  - [Blasting](#blasting)
  - [Book](#book)
    - [Rust 语言圣经中文版](#rust-语言圣经中文版)
    - [Rust 程序设计语言中文版](#rust-程序设计语言中文版)
    - [通过例子学 Rust 中文版](#通过例子学-rust-中文版)
    - [Rust 标准库手册中文版](#rust-标准库手册中文版)
  - [Article](#article)
  - [Framework](#framework)
    - [GUI](#gui)
      - [Tarui](#tarui)
      - [egui](#egui)
      - [fltk-rs](#fltk-rs)
      - [iced](#iced)
      - [druid](#druid)
    - [TUI](#tui)
      - [tui-rs](#tui-rs)
    - [游戏开发](#游戏开发)
      - [Bevy](#bevy)
    - [异步运行时](#异步运行时)
      - [Tokio](#tokio)
    - [前端相关](#前端相关)
      - [Yew](#yew)
      - [Deno](#deno)
      - [SWC](#swc)
      - [Parcel](#parcel)
      - [Rome](#rome)
      - [napi-rs](#napi-rs)
    - [WebAssembly](#webassembly)
      - [wasmtime](#wasmtime)
      - [wasmer](#wasmer)
      - [WasmEdge](#wasmedge)
      - [WASI](#wasi)
    - [网络](#网络)
      - [libp2p](#libp2p)
    - [服务端](#服务端)
      - [Rocket](#rocket)
      - [Actix Web](#actix-web)
      - [warp](#warp)
    - [数据库](#数据库)
      - [SeaORM](#seaorm)
      - [rbatis](#rbatis)
      - [MongoDB Rust Driver](#mongodb-rust-driver)
      - [wither](#wither)
      - [redis-rs](#redis-rs)
    - [单元测试](#单元测试)
      - [mockall](#mockall)
    - [几何计算](#几何计算)
      - [geo](#geo)
    - [图片处理](#图片处理)
      - [image](#image)
    - [系统相关](#系统相关)
      - [screenshots](#screenshots)
  - [Software](#software)
    - [GUI](#gui-1)
      - [Lapce](#lapce)
      - [Neovide](#neovide)
      - [Rustdesk](#rustdesk)
    - [TUI](#tui-1)
      - [GitUI](#gitui)
    - [CLI](#cli)
      - [bore](#bore)
      - [cloc-rs](#cloc-rs)
      - [cargo-edit](#cargo-edit)
  - [Community](#community)
  - [Incident](#incident)
  - [Note](#note)
  - [License](#license)

## Blasting

> 我自己写的一些关于 Rust 特殊问题的处理和解决方案。

TODO:

## Book

> Rust 的书。

### Rust 语言圣经中文版

![studyrut](https://camo.githubusercontent.com/7049c4a69eba95ba90bbfd186df2ad1e28f53dbeccc35491294aae31bde3266e/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f52757374436e2545372541342542452545352538432542412d6f72616e6765) [![Stars Count](https://camo.githubusercontent.com/40b1d0c88156f4dc36ef35a7dd900f8e4f16be505fbefcf049ea36df7de83707/68747470733a2f2f696d672e736869656c64732e696f2f6769746875622f73746172732f73756e666163652f727573742d636f757273653f7374796c653d666c6174)](https://github.com/sunface/rust-course/stargazers) [![img](https://camo.githubusercontent.com/90e66c956a5a293f7e01b0a58687c5bb32b72b6cdd00bbde30ab8081039e5664/68747470733a2f2f696d672e736869656c64732e696f2f6769746875622f6973737565732d70722d636c6f7365642d7261772f73756e666163652f727573742d636f757273652e7376673f7374796c653d666c6174)](https://github.com/sunface/rust-course/issues) [![Binder](https://camo.githubusercontent.com/581c077bdbc6ca6899c86d0acc6145ae85e9d80e6f805a1071793dbe48917982/68747470733a2f2f6d7962696e6465722e6f72672f62616467655f6c6f676f2e737667)](https://mybinder.org/v2/gh/ines/spacy-course/master)

> ![img](https://github.com/sunface/rust-course/blob/main/assets/banner.jpg?raw=true)
>
> Rust 语言真的好：连续七年成为全世界最受欢迎的语言、没有 GC 也无需手动内存管理、性能比肩 C++/C 还能直接调用它们的代码、安全性极高 - 总有公司说使用 Rust 后以前的大部分 bug 都将自动消失、全世界最好的包管理工具 Cargo 等等。但...

在线文档：[Rust 语言圣经 - Rust 语言圣经(Rust Course)](https://course.rs/about-book.html)

文档仓库：[sunface/rust-course: “连续六年成为全世界最受喜爱的语言，无 GC 也无需手动内存管理、极高的性能和安全性、过程/OO/函数式编程、优秀的包管理、JS 未来基石" — 工作之余的第二语言来试试 Rust 吧。<>拥有全面且深入的讲解、生动贴切的示例、德芙般丝滑的内容，甚至还有 JS 程序员关注的 WASM 和 Deno 等专题。这可能是目前最用心的 Rust 中文学习教程/书籍 (github.com)](https://github.com/sunface/rust-course)

### Rust 程序设计语言中文版

> Rust 程序设计语言的本质实际在于 **赋能**（_empowerment_）：无论你现在编写的是何种代码，Rust 能让你在更为广泛的编程领域走得更远，写出自信。（这一点并不显而易见）
>
> 举例来说，那些“系统层面”的工作涉及内存管理、数据表示和并发等底层细节。从传统角度来看，这是一个神秘的编程领域，只为浸润多年的极少数人所触及，也只有他们能避开那些臭名昭著的陷阱。即使谨慎的实践者，亦唯恐代码出现漏洞、崩溃或损坏。
>
> Rust 破除了这些障碍：它消除了旧的陷阱，并提供了伴你一路同行的友好、精良的工具。想要 “深入” 底层控制的程序员可以使用 Rust，无需时刻担心出现崩溃或安全漏洞，也无需因为工具链不靠谱而被迫去了解其中的细节。更妙的是，语言设计本身会自然而然地引导你编写出可靠的代码，并且运行速度和内存使用上都十分高效。
>
> 已经在从事编写底层代码的程序员可以使用 Rust 来提升抱负。例如，在 Rust 中引入并行是相对低风险的操作，因为编译器会替你找到经典的错误。同时你可以自信地采取更加激进的优化，而不会意外引入崩溃或漏洞。
>
> 但 Rust 并不局限于底层系统编程。它表达力强、写起来舒适，让人能够轻松地编写出命令行应用、网络服务器等各种类型的代码——在本书中就有这两者的简单示例。使用 Rust 能让你把在一个领域中学习的技能延伸到另一个领域：你可以通过编写网页应用来学习 Rust，接着将同样的技能应用到你的 Raspberry Pi（树莓派）上。
>
> 本书全面介绍了 Rust 为用户赋予的能力。其内容平易近人，致力于帮助你提升 Rust 的知识，并且提升你作为程序员整体的理解与自信。欢迎你加入 Rust 社区，让我们准备深入学习 Rust 吧！
>
> —— Nicholas Matsakis 和 Aaron Turon

在线文档：[Rust 程序设计语言](https://kaisery.github.io/trpl-zh-cn/#rust-程序设计语言)

### 通过例子学 Rust 中文版

> [Rust](https://www.rust-lang.org/) 是一门注重安全（safety）、速度（speed）和并发（concurrency）的现代系统编程语言。Rust 通过内存安全来实现以上目标，但不使用垃圾回收机制（garbage collection, GC）。
>
> 《通过例子学 Rust》（Rust By Example, RBE）内容由一系列可运行的实例组成，通过这些例子阐明了各种 Rust 的概念和基本库。想获取这些例子外的更多内容，不要忘了[安装 Rust 到本地](https://www.rust-lang.org/tools/install)并查阅[官方标准库文档](https://rustwiki.org/zh-CN/std/)。另外为了满足您的好奇心，您还可以[查阅本网站的源代码](https://github.com/rust-lang-cn/rust-by-example-cn)。

在线文档：[简介 - 通过例子学 Rust 中文版 (rustwiki.org)](https://rustwiki.org/zh-CN/rust-by-example/)

代码仓库：[rust-lang-cn/rust-by-example-cn: Rust By Example 中文版(包含在线代码编辑器) (github.com)](https://github.com/rust-lang-cn/rust-by-example-cn)

### Rust 标准库手册中文版

> Rust 标准库是可移植 Rust 软件的基础，这是一组针对 [更广泛的 Rust 生态系统](https://crates.io/) 的最小且经过实战测试的共享抽象。 它提供了核心类型，例如 [`Vec`](https://rustwiki.org/zh-CN/std/vec/struct.Vec.html) 和 [`Option`](https://rustwiki.org/zh-CN/std/option/enum.Option.html)，库定义的对 [语言原语](https://rustwiki.org/zh-CN/std/#primitives) 的操作，[标准库宏](https://rustwiki.org/zh-CN/std/#macros)，[I/O](https://rustwiki.org/zh-CN/std/io/index.html) 和 [多线程](https://rustwiki.org/zh-CN/std/thread/index.html)，以及许多 [其他](https://rustwiki.org/zh-CN/std/#what-is-in-the-standard-library-documentation) 东西。
>
> 默认情况下，`std` 可用于所有 Rust crates。因此，可以通过 [`use`](https://rustwiki.org/zh-CN/book/ch07-02-defining-modules-to-control-scope-and-privacy.html) 语句使用路径 `std` 来访问标准库，就像在 [`use std::env`](https://rustwiki.org/zh-CN/std/env/index.html) 中一样。

在线文档：[std - Rust (rustwiki.org)](https://rustwiki.org/zh-CN/std/)

## Article

> 收集一些 Rust 比较好的文章内容。

- [rust 语言基础学习: rust 所有权之 Move 和 Copy 语义 - 架构小白|青蛙小白|关注程序开发、互联网技术、云原生 (frognew.com)](https://blog.frognew.com/2020/07/rust-ownership-move-and-copy.html)
- [Top 23 Rust GUI Projects (Jul 2022) (libhunt.com)](https://www.libhunt.com/l/rust/topic/gui)

## Framework

> Rust 开发的框架。

### GUI

#### Tarui

![stars](https://img.shields.io/github/stars/tauri-apps/tauri?style=flat) ![GitHub](https://img.shields.io/github/license/tauri-apps/tauri)

> Tauri 是一个为所有主要桌面平台构建微小、速度极快的二进制文件的框架。开发人员可以集成任何编译为 HTML、JS 和 CSS 的前端框架，以构建其用户界面。应用程序的后端是一个 Rust 的二进制文件，前端可以与之交互。
>
> Tauri 应用程序中的用户界面目前将 tao 用作 macOS 和 Windows 上的窗口处理库，并通过 Tauri 团队孵化和维护 WRY 在 Linux 上使用 gtk，该团队利用 macOS 上的 WebKit、Windows 上的 WebView2 和 Linux 上的 WebKitGTK，为系统 webview（以及菜单和任务栏等其他好东西）创建了统一的界面。

代码仓库：[tauri-apps/tauri: Build smaller, faster, and more secure desktop applications with a web frontend. (github.com)](https://github.com/tauri-apps/tauri)

在线网站：[Build smaller, faster, and more secure desktop applications with a web frontend | Tauri Apps](https://tauri.app/zh/)https://tauri.studio/

#### egui

![stars](https://img.shields.io/github/stars/emilk/egui?style=flat) ![GitHub](https://img.shields.io/github/license/emilk/egui)

> egui 是一个简单、快速、高度可移植的 Rust 即时模式 GUI 库。egui 可运行于 Web, 原生（_Native_） 甚至 [你喜欢的的游戏引擎](https://github.com/Re-Ch-Love/egui-doc-cn/blob/main/README_zh-hans.md#integrations) （即将到来）。
>
> egui 旨在成为最易用的 Rust GUI 库，用最简单的方式创建 Web 应用程序。
>
> egui 可以在任何可以绘制纹理三角形（textured triangles）的地方使用，这意味着你可以轻松地地将它集成到你选择的游戏引擎中。

代码仓库：[emilk/egui: egui: an easy-to-use immediate mode GUI in Rust that runs on both web and native (github.com)](https://github.com/emilk/egui)

中文文档：[egui-doc-cn/README_zh-hans.md at main · Re-Ch-Love/egui-doc-cn (github.com)](https://github.com/Re-Ch-Love/egui-doc-cn/blob/main/README_zh-hans.md)

#### fltk-rs

![stars](https://img.shields.io/github/stars/fltk-rs/fltk-rs?style=flat) ![GitHub](https://img.shields.io/github/license/fltk-rs/fltk-rs)

> FLTK 图形用户界面库的 Rust 绑定。
> fltk crate 是一个跨平台的轻量级 gui 库，可以静态链接以生成小型、自包含和快速的 gui 应用程序。

代码仓库：[fltk-rs/fltk-rs: Rust bindings for the FLTK GUI library. (github.com)](https://github.com/fltk-rs/fltk-rs)

在线文档：[Home - fltk book (fltk-rs.github.io)](https://fltk-rs.github.io/fltk-book/)

#### iced

![stars](https://img.shields.io/github/stars/iced-rs/iced?style=flat) ![GitHub](https://img.shields.io/github/license/iced-rs/iced)

> Rust 的跨平台 GUI 库，专注于简单性和类型安全。灵感来自 Elm。

代码仓库：[iced-rs/iced: A cross-platform GUI library for Rust, inspired by Elm (github.com)](https://github.com/iced-rs/iced)

#### druid

![stars](https://img.shields.io/github/stars/linebender/druid?style=flat) ![GitHub](https://img.shields.io/github/license/linebender/druid)

> Druid 是一个实验性的 Rust 原生 UI 工具包。它的主要目标是提供优美的用户体验。这个目标有很多因素，包括性能、丰富的交互调色板（因此有一个小部件库来支持它们），以及与本机平台的良好配合。有关详细信息，请参阅目标部分。
> Druid 目前的发展很大程度上是由它在 Runebender 中的使用推动的，这是一种新的字体编辑器。
> 我们一直在 crates.io 上定期发布 Druid，但它正在积极开发中，它的 API 可能会改变。所有更改都记录在更改日志中。
> 有关一些关键概念的概述，请参阅（正在进行的工作）Druid 书。

代码仓库：[linebender/druid: A data-first Rust-native UI design toolkit. (github.com)](https://github.com/linebender/druid)

### TUI

#### tui-rs

![stars](https://img.shields.io/github/stars/fdehau/tui-rs?style=flat) ![GitHub](https://img.shields.io/github/license/fdehau/tui-rs)

> tui-rs 是一个 Rust 库，用于构建丰富的终端用户界面和仪表板。它深受 Javascript 库 blessed-contrib 和 Go 库 termui 的启发。
>
> [![Demo cast under Linux Termite with Inconsolata font 12pt](https://github.com/fdehau/tui-rs/raw/master/assets/demo.gif)](https://github.com/fdehau/tui-rs/blob/master/assets/demo.gif)

代码仓库：[fdehau/tui-rs: Build terminal user interfaces and dashboards using Rust (github.com)](https://github.com/fdehau/tui-rs)

### 游戏开发

#### Bevy

![stars](https://img.shields.io/github/stars/bevyengine/bevy?style=flat)[![Crates.io](https://camo.githubusercontent.com/fe403c1f013640f6a78617b79155ed3df66042f74918ef4305d7154b7c4d424b/68747470733a2f2f696d672e736869656c64732e696f2f6372617465732f762f626576792e737667)](https://crates.io/crates/bevy) [![MIT/Apache 2.0](https://camo.githubusercontent.com/a927c5826a9c362ad9778573df3f91dafa35a99f15db09e407c8edb1e1424280/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f6c6963656e73652d4d49542532464170616368652d626c75652e737667)](https://github.com/bevyengine/bevy/blob/main/LICENSE) [![Crates.io](https://camo.githubusercontent.com/c394677215ba5d5b4291703a798a74f3211789e83e6fcffce11c1ef4150f3c19/68747470733a2f2f696d672e736869656c64732e696f2f6372617465732f642f626576792e737667)](https://crates.io/crates/bevy) [![Rust](https://github.com/bevyengine/bevy/workflows/CI/badge.svg)](https://github.com/bevyengine/bevy/actions) [![iOS cron CI](https://github.com/bevyengine/bevy/workflows/iOS%20cron%20CI/badge.svg)](https://github.com/bevyengine/bevy/workflows/iOS cron CI/badge.svg) [![Discord](https://camo.githubusercontent.com/af9f050b14de7da58365e64b51287b05f65a2124f152778e3ad5d18b4258fe57/68747470733a2f2f696d672e736869656c64732e696f2f646973636f72642f3639313035323433313532353637353034382e7376673f6c6162656c3d266c6f676f3d646973636f7264266c6f676f436f6c6f723d66666666666626636f6c6f723d373338394438266c6162656c436f6c6f723d364137454332)](https://discord.gg/bevy)

> Bevy 是 Rust 内置的令人耳目一新的简单数据驱动游戏引擎。它永远是免费和开源的！

代码仓库：[bevyengine/bevy: A refreshingly simple data-driven game engine built in Rust (github.com)](https://github.com/bevyengine/bevy)

### 异步运行时

#### Tokio

![stars](https://img.shields.io/github/stars/rustdesk/rustdesk?style=flat) ![GitHub](https://img.shields.io/github/license/rustdesk/rustdesk)

> Tokio 是 Rust 编程语言的异步运行时。它提供了编写网络应用程序所需的构建块。它提供了针对广泛系统的灵活性，从具有数十个内核的大型服务器到小型嵌入式设备。

代码仓库：[tokio-rs/tokio: A runtime for writing reliable asynchronous applications with Rust. Provides I/O, networking, scheduling, timers, ... (github.com)](https://github.com/tokio-rs/tokio)

在线网站：[Tokio - An asynchronous Rust runtime](https://tokio.rs/)

### 前端相关

#### Yew

![stars](https://img.shields.io/github/stars/yewstack/yew?style=flat) ![GitHub](https://img.shields.io/github/license/yewstack/yew)[![Crate Info](https://camo.githubusercontent.com/bb4512e464e4162a4e1385091559d7563c121536fafd8da99c1110c82a12f542/68747470733a2f2f696d672e736869656c64732e696f2f6372617465732f762f7965772e737667)](https://crates.io/crates/yew) [![API Docs](https://camo.githubusercontent.com/b065a13fdf007e7d99827379a25f389f9adf212c297d7d0a18b42262e98483a5/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f646f63732e72732d7965772d677265656e)](https://docs.rs/yew/) [![Discord Chat](https://camo.githubusercontent.com/e79a58c0e24459631aae93cb2e79efcad8ad866ed3f33b1ca4b3666a1447045e/68747470733a2f2f696d672e736869656c64732e696f2f646973636f72642f373031303638333432373630353730393333)](https://discord.gg/VQck8X4) [![img](https://camo.githubusercontent.com/25affe7c13808f6d5a2afdc2618d6b8ca487575f6109da5ff956f47d8b73f548/68747470733a2f2f6769746c6f63616c697a652e636f6d2f7265706f2f373035322f77686f6c655f70726f6a6563742f62616467652e737667) ](https://gitlocalize.com/repo/7052/whole_project?utm_source=badge)[![Rustc Version 1.56.1+](https://camo.githubusercontent.com/4013cf1aa9b8a8a4d55e308d1d2c898319b29e304215b23d348c47eaf019bff9/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f72757374632d312e35362532422d6c69676874677265792e737667)](https://blog.rust-lang.org/2020/12/31/Rust-1.56.1.html)

> **Yew** 是一个设计先进的 [Rust](https://www.rust-lang.org/) 框架，目的是使用 [WebAssembly](https://webassembly.org/) 来创建多线程的前端 web 应用。

代码仓库：[yewstack/yew: Rust / Wasm framework for building client web apps (github.com)](https://github.com/yewstack/yew)

资源仓库：[jetli/awesome-yew: 😎 A curated list of awesome things related to Yew / WebAssembly. (github.com)](https://github.com/jetli/awesome-yew)

#### Deno

![stars](https://img.shields.io/github/stars/denoland/deno?style=flat) ![GitHub](https://img.shields.io/github/license/denoland/deno)

> Deno 是一个简单、现代且安全的 JavaScript 和 TypeScript 运行时，它使用 V8 并内置于 Rust。

代码仓库：[denoland/deno: A modern runtime for JavaScript and TypeScript. (github.com)](https://github.com/denoland/deno)

#### SWC

![stars](https://img.shields.io/github/stars/swc-project/swc?style=flat) ![GitHub](https://img.shields.io/github/license/swc-project/swc)

> 一个代码打包器。
>
> SWC（代表 Speedy Web Compiler）是一个用 Rust 编写的超快速 TypeScript / JavaScript 编译器。它同时是 Rust 和 JavaScript 的库。如果您使用 Rust 的 SWC，请参阅 rustdoc，对于大多数用户，您使用该库的入口点将是解析器。

代码仓库：[swc-project/swc: Rust-based platform for the Web (github.com)](https://github.com/swc-project/swc)

#### Parcel

![stars](https://img.shields.io/github/stars/parcel-bundler/parcel?style=flat) ![GitHub](https://img.shields.io/github/license/parcel-bundler/parcel)

> Parcel 是用于 web 的零配置构建工具。它将优秀的开箱即用的开发经验与可扩展的体系结构结合在一起，可以将您的项目从刚开始的阶段转变为大规模的生产应用程序。

代码仓库：[parcel-bundler/parcel: The zero configuration build tool for the web. 📦🚀 (github.com)](https://github.com/parcel-bundler/parcel)

#### Rome

![stars](https://img.shields.io/github/stars/rome/tools?style=flat) ![GitHub](https://img.shields.io/github/license/rome/tools)

> Rome 是用于 JavaScript、TypeScript、JSON、HTML、Markdown 和 CSS 的格式化程序、linter、捆绑程序等。
> Rome 旨在取代 Babel、ESLint、webpack、Prettier、Jest 等。
> Rome 统一了以前是独立工具的功能。建立在一个共享的基础上，我们可以为处理代码、显示错误、并行化工作、缓存和配置提供一种内聚的体验。
> Rome 有很强的约定，旨在具有最小的配置。阅读更多关于我们的项目理念的信息。
> Rome 是用 Rust 编写的。
> Rome 拥有一流的 IDE 支持，具有复杂的解析器，可以完全保真地表示源文本和一流的错误恢复。
> Rome 是麻省理工学院根据贡献者契约行为准则获得许可和管理的。

代码仓库：[rome/tools: The Rome Toolchain. A linter, compiler, bundler, and more for JavaScript, TypeScript, HTML, Markdown, and CSS. (github.com)](https://github.com/rome/tools)

#### napi-rs

![stars](https://img.shields.io/github/stars/napi-rs/napi-rs?style=flat) [![img](https://camo.githubusercontent.com/12926a0d167dddc752b4a243bdfe42510ec152c409e0adb5c5a0358d69b2f955/68747470733a2f2f646f63732e72732f6e6170692f62616467652e737667)](https://docs.rs/crate/napi) [![img](https://camo.githubusercontent.com/50f427da9d2e4aefd0501af3a6463800ae9c07ecf76495ae40048f1b76d267f0/68747470733a2f2f696d672e736869656c64732e696f2f6372617465732f762f6e6170692e737667)](https://crates.io/crates/napi) [![img](https://camo.githubusercontent.com/19bbf2a0c1204f71ecf1ed7ff797200fe2129e276fb18c33e8e3b24c85f460eb/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f762f406e6170692d72732f636c692e737667)](https://www.npmjs.com/package/@napi-rs/cli)

> 用于在 Rust 中构建已编译的 Node.js 附加组件的最小库。

代码仓库：[napi-rs/napi-rs: A framework for building compiled Node.js add-ons in Rust via Node-API (github.com)](https://github.com/napi-rs/napi-rs)

### WebAssembly

#### wasmtime

![stars](https://img.shields.io/github/stars/bytecodealliance/wasmtime?style=flat) ![GitHub](https://img.shields.io/github/license/bytecodealliance/wasmtime)

> WebAssembly 的运行时

代码仓库：[bytecodealliance/wasmtime: A standalone runtime for WebAssembly (github.com)](https://github.com/bytecodealliance/wasmtime)

#### wasmer

![stars](https://img.shields.io/github/stars/wasmerio/wasmer?style=flat) ![GitHub](https://img.shields.io/github/license/wasmerio/wasmer)

> WebAssembly 又一个运行时

代码仓库：[wasmerio/wasmer: 🚀 The leading WebAssembly Runtime supporting WASI and Emscripten (github.com)](https://github.com/wasmerio/wasmer)

#### WasmEdge

![stars](https://img.shields.io/github/stars/WasmEdge/WasmEdge?style=flat) ![GitHub](https://img.shields.io/github/license/WasmEdge/WasmEdge)

> WebAssembly 又又一个运行时
>
> WasmEdge 是一个轻量级、高性能和可扩展的 WebAssembly 运行时，适用于云原生、边缘和去中心化应用程序。它为无服务器应用程序、嵌入式功能、微服务、智能合约和物联网设备提供支持。

代码仓库：[WasmEdge/WasmEdge: WasmEdge is a lightweight, high-performance, and extensible WebAssembly runtime for cloud native, edge, and decentralized applications. It powers serverless apps, embedded functions, microservices, smart contracts, and IoT devices. (github.com)](https://github.com/WasmEdge/WasmEdge)

#### WASI

![stars](https://img.shields.io/github/stars/WebAssembly/WASI?style=flat) [![DOI](https://camo.githubusercontent.com/968b57157bc1ae57a965f38fa2fd266cc458f510dc81413e4482d8c8484bf054/68747470733a2f2f7a656e6f646f2e6f72672f62616467652f444f492f31302e353238312f7a656e6f646f2e343332333434372e737667)](https://doi.org/10.5281/zenodo.4323447)

> 为 WebAssembly 提供内部调用接口的库
>
> WASI 不是一个单一的标准系统接口，而是标准化 API 的模块化集合。不需要实现任何 API 即可具有兼容的运行时。相反，主机环境可以选择哪些 API 对其用例有意义。

代码仓库：[WebAssembly/WASI: WebAssembly System Interface (github.com)](https://github.com/WebAssembly/WASI)

### 网络

#### libp2p

![stars](https://img.shields.io/github/stars/libp2p/rust-libp2p?style=flat) ![GitHub](https://img.shields.io/github/license/libp2p/rust-libp2p)

> 构建 p2p 网络的包
> 运行您的网络应用程序，不受运行时和地址服务的影响，与它们的位置无关。

代码仓库：[libp2p/rust-libp2p: The Rust Implementation of the libp2p networking stack. (github.com)](https://github.com/libp2p/rust-libp2p)

### 服务端

#### Rocket

![stars](https://img.shields.io/github/stars/SergioBenitez/Rocket?style=flat) ![GitHub](https://img.shields.io/github/license/SergioBenitez/Rocket)

> [Rocket](https://github.com/SergioBenitez/Rocket)是 Rust 生态系统中对初学者来说最容易上手的 web 框架。
>
> 它是高度可定制化的，可以快速启动一个新的应用程序。同时，它避免了许多不必要的文件。
>
> 与 Actix Web 不同的是，该框架运行在 Rust 语言的“实验”版本)上。

代码仓库：[SergioBenitez/Rocket: A web framework for Rust. (github.com)](https://github.com/SergioBenitez/Rocket)

#### Actix Web

![stars](https://img.shields.io/github/stars/actix/actix-web?style=flat) ![GitHub](https://img.shields.io/github/license/actix/actix-web)

> Actix Web 是一个功能强大、实用且速度极快的 Rust Web 框架.
>
> - 支持 HTTP/1.x 和 HTTP/2
> - 流和流水线
> - 带有可选宏的强大请求路由
> - 完全兼容 Tokio
> - 保持活动和缓慢的请求处理
> - 客户端/服务器 WebSocket 支持
> - 透明内容压缩/解压缩（br、gzip、deflate、zstd）
> - 多部分流
> - 静态资产
> - 使用 OpenSSL 或 Rustls 的 SSL 支持
> - 中间件（记录器、会话、CORS 等）
> - 与 awc HTTP 客户端集成
> - 在稳定的 Rust 1.57+ 上运行

代码仓库：[actix/actix-web: Actix Web is a powerful, pragmatic, and extremely fast web framework for Rust. (github.com)](https://github.com/actix/actix-web)

#### warp

![stars](https://img.shields.io/github/stars/seanmonstar/warp?style=flat) ![GitHub](https://img.shields.io/github/license/seanmonstar/warp)

> 一个超级简单、可组合的 web 服务器框架，用于提高 warp 速度。
> warp 的基本构建块是过滤器：它们可以组合和组合来表达对请求的丰富需求。
> 由于其过滤器系统，warp 提供了这些开箱即用的功能：
>
> - 路径路由和参数提取
> - 标头要求和提取
> - 查询字符串反序列化
> - JSON 和表单主体
> - 多部分表单数据
> - 静态文件和目录
> - 网络套接字
> - 访问记录
> - Gzip、Deflate 和 Brotli 压缩

代码仓库：[seanmonstar/warp: A super-easy, composable, web server framework for warp speeds. (github.com)](https://github.com/seanmonstar/warp)

### 数据库

#### SeaORM

![stars](https://img.shields.io/github/stars/SeaQL/sea-orm?style=flat) ![GitHub](https://img.shields.io/github/license/SeaQL/sea-orm)

> SeaORM 是一种关系 ORM，可帮助您使用熟悉的动态语言在 Rust 中构建 Web 服务。
>
> 目前支持:
>
> - `sqlx-mysql`- SQLx MySQL
> - `sqlx-postgres`- SQLx PostgreSQL
> - `sqlx-sqlite`- SQLx SQLite

代码仓库：[SeaQL/sea-orm: 🐚 An async & dynamic ORM for Rust (github.com)](https://github.com/SeaQL/sea-orm)

#### rbatis

![stars](https://img.shields.io/github/stars/rbatis/rbatis?style=flat) ![GitHub](https://img.shields.io/github/license/rbatis/rbatis)

> 受 Mybatis 和 MybatisPlus 启发，用 Rust 编写的高性能、安全、动态 SQL（编译时）ORM 框架。
>
> - \- 编译时动态 sql（mybatis 动态 sql 标签）、全异步(Future)、生产实践([abs_admin](https://github.com/rbatis/abs_admin))、
> - \- 内存安全，协程安全，事务安全(防忘提交)，百分百 safe 代码
> - \- 多种插件，分页/逻辑删除/sql 拦截器/CRUD/Wrapper/PySQL/HtmlSQL
>
> 支持数据库：
>
> | 数据库                | 已支持 |
> | --------------------- | ------ |
> | Mysql                 | √      |
> | Postgres              | √      |
> | Sqlite                | √      |
> | Mssql/Sqlserver       | √(50%) |
> | MariaDB(Mysql)        | √      |
> | TiDB(Mysql)           | √      |
> | CockroachDB(Postgres) | √      |

代码仓库：[rbatis/rbatis: Rust High Performance compile-time ORM(RBSON based) (github.com)](https://github.com/rbatis/rbatis)

#### MongoDB Rust Driver

![stars](https://img.shields.io/github/stars/mongodb/mongo-rust-driver?style=flat) ![GitHub](https://img.shields.io/github/license/mongodb/mongo-rust-driver)

> 此存储库包含官方支持的 MongoDB Rust 驱动程序，这是一个客户端库，可用于与 Rust 应用程序中的 MongoDB 部署进行交互。它使用 bson crate 来支持 BSON。该驱动程序包含一个完全异步的 API，它支持 tokio（默认）或 async-std，具体取决于设置的功能标志。驱动程序还有一个同步 API，可以通过功能标志启用。

代码仓库：[mongodb/mongo-rust-driver: The official MongoDB Rust Driver (github.com)](https://github.com/mongodb/mongo-rust-driver)

#### wither

![stars](https://img.shields.io/github/stars/thedodd/wither?style=flat) ![GitHub](https://img.shields.io/github/license/thedodd/wither)

> 该项目的主要目标是基于数据模型为 MongoDB 提供一个简单、健全且可预测的接口。如果在任何时候该系统可能会妨碍您，您可以直接访问底层驱动程序。该项目针对 MongoDB 3.6、4.0、4.2 和 4.4 进行了测试。
> 好消息！ Wither 现在基于官方的 MongoDB Rust 驱动程序。由于驱动程序的进步，Wither 现在是完全异步的。简单地镜像底层 MongoDB 驱动程序的功能，Wither 支持以下运行时：
> tokio-runtime（默认）激活 tokio 运行时。
> async-std-runtime 激活 async-std 运行时。
> 由于底层驱动程序的更新，Model trait 以及 Model 派生宏有相当多的重大变化。详细信息可以在更改日志和文档中找到。此外，现在默认情况下一切都是异步的，并且同步接口已从 repo 中完全删除。

代码仓库：[thedodd/wither: An ODM for MongoDB built on the official MongoDB Rust driver. (github.com)](https://github.com/thedodd/wither)

#### redis-rs

![stars](https://img.shields.io/github/stars/redis-rs/redis-rs?style=flat)![GitHub](https://img.shields.io/github/license/redis-rs/redis-rs)

> Redis-rs 是 Rust 的高级 redis 库。它通过非常灵活但低级的 API 提供对所有 Redis 功能的便捷访问。它使用可自定义的类型转换特征，因此任何操作都可以返回您期望的类型的结果。这带来了非常愉快的开发体验。

代码仓库：[redis-rs/redis-rs: Redis library for rust (github.com)](https://github.com/redis-rs/redis-rs)

### 单元测试

#### mockall

![stars](https://img.shields.io/github/stars/asomers/mockall?style=flat) ![GitHub](https://img.shields.io/github/license/asomers/mockall)

> 适用于 Rust 的强大模拟对象库。

代码仓库：[asomers/mockall: A powerful mock object library for Rust (github.com)](https://github.com/asomers/mockall)

### 几何计算

#### geo

![stars](https://img.shields.io/github/stars/georust/geo?style=flat) ![GitHub](https://img.shields.io/github/license/georust/geo)

> geo crate 提供了点、线串和多边形等地理空间基元类型，并提供了算法和操作，例如：
> 面积和质心计算
>
> - 简化和凸包操作
> - 欧几里得和哈弗辛距离测量
> - 交叉口检查
> - 仿射变换，例如旋转和平移。
>
> ⚠️：如果需要计算距离所有的坐标使用 f64，这是小编踩过的坑.

代码仓库：[georust/geo: Geospatial primitives and algorithms for Rust (github.com)](https://github.com/georust/geo)

### 图片处理

#### image

![stars](https://img.shields.io/github/stars/image-rs/image?style=flat) ![GitHub](https://img.shields.io/github/license/image-rs/image)

> 这个 crate 提供了基本的图像处理功能和方法来转换各种图像格式。
> 提供的所有图像处理函数都对实现 GenericImageView 和 GenericImage 特征并返回 ImageBuffer 的类型进行操作。

代码仓库：[image-rs/image: Encoding and decoding images in Rust (github.com)](https://github.com/image-rs/image)

### 系统相关

#### screenshots

![stars](https://img.shields.io/github/stars/nashaofu/screenshots-rs?style=flat) ![GitHub](https://img.shields.io/github/license/nashaofu/screenshots-rs)

> 适用于 MacOS、Windows、Linux(X11、wayland) 的跨平台截图库。

代码仓库：[nashaofu/screenshots-rs: A cross-platform screenshots library for MacOS、Windows、Linux(X11、wayland). (github.com)](https://github.com/nashaofu/screenshots-rs)

## Software

> 用 Rust 编写的一些实用的应用软件。

### GUI

#### Lapce

[![img](https://github.com/lapce/lapce/actions/workflows/ci.yml/badge.svg) ](https://github.com/lapce/lapce/actions/workflows/ci.yml)[![img](https://camo.githubusercontent.com/f4b65e11e9240c0224ac350bc93a84300c0049071ee0fea60e45a00afda9f40e/68747470733a2f2f696d672e736869656c64732e696f2f646973636f72642f3934363835383736313431333332383934363f6c6f676f3d646973636f7264) ](https://discord.gg/n8tGJ6Rn6D)[![img](https://camo.githubusercontent.com/1d50a7d67f2889e6cfd13dff89a4ef5242a986ec1b4a497be75a5c3675db95be/68747470733a2f2f696d672e736869656c64732e696f2f6d61747269782f6c617063652d656469746f723a6d61747269782e6f72673f636f6c6f723d74757271756f697365266c6f676f3d4d6174726978) ](https://matrix.to/#/#lapce-editor:matrix.org)[![Lapce Docs](https://camo.githubusercontent.com/a5442559b3a0b6a569e7834d6d55dee097e45609104462b82c96aa5bb5f94bf9/68747470733a2f2f696d672e736869656c64732e696f2f7374617469632f76313f6c6162656c3d446f6373266d6573736167653d646f63732e6c617063652e64657626636f6c6f723d626c7565)](https://docs.lapce.dev/)

> Lapce 是用纯 Rust 编写的，用户界面是 Druid（也是用 Rust 编写）。它是用 Xi-Editor 的 Rope Science 设计的，使得计算速度快如闪电，并利用 OpenGL 进行渲染。关于 Lapce 功能的更多信息可以在主网站上找到，用户文档可以在 GitBook 上找到。
>
> ![image-20220723211542645](readme.assets/image-20220723211542645.png)

一个有点像是 VSCode 的编辑器。

代码仓库：[lapce/lapce: Lightning-fast and Powerful Code Editor written in Rust (github.com)](https://github.com/lapce/lapce)

#### Neovide

[![Discord](https://camo.githubusercontent.com/8c289bc2e543bede952e249c23fb8e5a641878a4921bd5cf93a535ec78d4e4c6/68747470733a2f2f62616467656e2e6e65742f62616467652f69636f6e2f646973636f72643f69636f6e3d646973636f7264266c6162656c)](https://discord.gg/SjFpZdQys6) [![Chat on Matrix](https://camo.githubusercontent.com/49267a500b35c3df117c7227b1d812e62c1460715894622a385e2477b103d28f/68747470733a2f2f6d61747269782e746f2f696d672f6d61747269782d62616467652e737667)](https://matrix.to/#/#neovide_community:gitter.im) [![Discussions](https://camo.githubusercontent.com/e406a82ccda7bcf2a0fcef447975af40b3eeaa28255fd2a5dac02c3f0def5e86/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f4769744875622d44697363757373696f6e732d677265656e3f6c6f676f3d676974687562)](https://github.com/neovide/neovide/discussions)

> 这是 Neovim（一个经过积极重构和更新的 Vim 编辑器）的简单图形用户界面。在可能的情况下，有一些图形改进，但在功能上，它应该像终端用户界面一样。
>
> [![Basic Screen Cap](https://github.com/neovide/neovide/raw/main/assets/BasicScreenCap.png)](https://github.com/neovide/neovide/blob/main/assets/BasicScreenCap.png)

仓库链接：[neovide/neovide: No Nonsense Neovim Client in Rust (github.com)](https://github.com/neovide/neovide)

#### Rustdesk

![stars](https://img.shields.io/github/stars/rustdesk/rustdesk?style=flat) ![GitHub](https://img.shields.io/github/license/rustdesk/rustdesk)

> 面向所有人的开源虚拟/远程桌面基础架构！开源的 TeamViewer 替代方案。显示和控制您的 PC 和安卓设备。
>
> [![image](https://user-images.githubusercontent.com/71636191/171661982-430285f0-2e12-4b1d-9957-4a58e375304d.png)](https://user-images.githubusercontent.com/71636191/171661982-430285f0-2e12-4b1d-9957-4a58e375304d.png)

仓库链接：[rustdesk/rustdesk：为每个人提供开源虚拟/远程桌面基础架构！开源的 TeamViewer 替代方案。显示和控制您的 PC 和安卓设备。 (github.com)](https://github.com/rustdesk/rustdesk)

### TUI

#### GitUI

![stars](https://img.shields.io/github/stars/extrawurst/gitui?style=flat) ![GitHub](https://img.shields.io/github/license/extrawurst/gitui)

> GitUI 为您提供了 git GUI 的舒适性，但就在您的终端上.
>
> [![img](https://github.com/extrawurst/gitui/raw/master/demo.gif)](https://github.com/extrawurst/gitui/blob/master/demo.gif)

代码仓库：[extrawurst/gitui: Blazing 💥 fast terminal-ui for git written in rust 🦀 (github.com)](https://github.com/extrawurst/gitui)

### CLI

#### bore

![stars](https://img.shields.io/github/stars/ekzhang/bore?style=flat) ![GitHub](https://img.shields.io/github/license/ekzhang/bore)

> Rust 中的一个现代、简单的 TCP 隧道，它将本地端口暴露给远程服务器，绕过标准 NAT 连接防火墙。这就是它所做的一切：不多也不少。
>
> [![Video demo](https://camo.githubusercontent.com/895c0a44b8f14a929f4efbeda90eeb4149610a901f85ef03f50a3cbfacabbb76/68747470733a2f2f692e696d6775722e636f6d2f76446547736d782e676966)](https://camo.githubusercontent.com/895c0a44b8f14a929f4efbeda90eeb4149610a901f85ef03f50a3cbfacabbb76/68747470733a2f2f692e696d6775722e636f6d2f76446547736d782e676966)

代码仓库：[ekzhang/bore: 🕳 bore is a simple CLI tool for making tunnels to localhost (github.com)](https://github.com/ekzhang/bore)

#### cloc-rs

![stars](https://img.shields.io/github/stars/ltoddy/cloc-rs?style=flat) ![GitHub](https://img.shields.io/github/license/ltoddy/cloc-rs)

> 快速计算或计算源代码行和注释的差异。
>
> ```
> macbox :: github/kubernetes » time cloc .
>      72.5313 secs
> ┌───────────────────────────────────────────────────────────────────────────────────────┐
> │ Language                        files        size       blank     comment        code │
> ├───────────────────────────────────────────────────────────────────────────────────────┤
> │ Autoconf                          533   515.91 KB         100         992       21399 │
> │ Bash                              148   420.09 KB        1183         592       10153 │
> │ C                                 149   149.31 KB         970        1671        3065 │
> │ C Header                           25     6.94 MB        9975      109175       20975 │
> │ GNU Style Assembly               2946     8.96 MB       48895       43894      285473 │
> │ Go                             463514     4.44 GB    13873486    22200757   106047029 │
> │ Html                               50    950.00 B           0           0          50 │
> │ Ini                                24     5.70 KB          48           0         240 │
> │ JSON                            21759  1011.18 MB         100           0    23771190 │
> │ Lua                                25   419.92 KB         750         100       11875 │
> │ Markdown                        18270   162.09 MB      530001           0     1794019 │
> │ Plain Text                       1161     5.50 MB        7186           0      176276 │
> │ PowerShell                        174     2.92 MB        8947       74817        1149 │
> │ Protocol Buffer                  4489    51.42 MB      220374      684092      425720 │
> │ Python                            175   581.23 KB        2975        5500        8750 │
> │ SVG                               101     1.22 MB         101         101        9532 │
> │ Shell                            9470    56.70 MB      189547      361195      998808 │
> │ Toml                              299   342.58 KB        3667        4325        7223 │
> │ Yaml                            38405   140.98 MB       31308       31043     5317632 │
> ├───────────────────────────────────────────────────────────────────────────────────────┤
> │ Sum                            561717     5.86 GB    14929613    23518254   138910558 │
> └───────────────────────────────────────────────────────────────────────────────────────┘
> cloc .  23.21s user 153.47s system 239% cpu 1:13.72 total
> ```

代码仓库：[ltoddy/cloc-rs: Count, or compute differences of, lines of source code and comments fastly. (github.com)](https://github.com/ltoddy/cloc-rs)

#### cargo-edit

![stars](https://img.shields.io/github/stars/killercup/cargo-edit?style=flat) ![GitHub](https://img.shields.io/github/license/killercup/cargo-edit)

> 该工具扩展了 Cargo，允许您通过从命令行修改 Cargo.toml 文件来添加、删除和升级依赖项。
> 当前可用的子命令：
>
> - [`cargo rm`](https://github.com/killercup/cargo-edit#cargo-rm)
> - [`cargo upgrade`](https://github.com/killercup/cargo-edit#cargo-upgrade)
> - [`cargo set-version`](https://github.com/killercup/cargo-edit#cargo-set-version)

代码仓库：[killercup/cargo-edit: A utility for managing cargo dependencies from the command line. (github.com)](https://github.com/killercup/cargo-edit)

## Community

> Rust 相关的社区。

- [Rust 语言中文社区-首页 (rustcc.cn)](https://rustcc.cn/)
- [Rust 技术论坛 | Rust 语言技术论坛 - 优质的 Rust 开发者学习社区 (learnku.com)](https://learnku.com/rust)
- [The Rust Programming Language Forum (rust-lang.org)](https://users.rust-lang.org/)

## Incident

> Rust 相关的热点新闻或事件。

- 2022-07-03 [Linux 内核将引入 Rust，Linus：以防此事搞砸了我又发脾气，先给大家道个歉-51CTO.COM](https://os.51cto.com/article/713004.html)

## Note

封面图来自：[Rustacean.net: Home of Ferris the Crab](https://rustacean.net/)

徽章来自：[Shields.io: Quality metadata badges for open source projects](https://shields.io/category/license)

如果你有自己用 Rust 开发的软件或者推荐的资源都可以提交 PR，在这里感谢所有为 Rust 生态贡献的开发者，因为只有越来越丰富的生态才能吸引更多的人来学习使用 Rust。

最后希望 Rust 越来越牛 X。

如果文档有用请帮帮忙点一下 star，收集整理不易。

## License

MIT
