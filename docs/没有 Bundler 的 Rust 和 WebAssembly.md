# 不使用 Bundler 的 Rust 和 WebAssembly



如果您刚刚开始将 Rust 代码编译到 WebAssembly 中并希望将其加载到 Web 浏览器中，那么您可能会对这样做的多种方式感到吃惊。这似乎是由于多年来 Web 浏览器实现 Web 平台功能的速度不同。为了方便起见，许多使用 Rust 和 WebAssembly 的入门级指南都使用了 JavaScript 捆绑器，但这掩盖了 Rust、WebAssembly、JavaScript 和 HTML 之间的关系，因此我们将尝试手动完成所有这些。具体来说，我们将把一些 Rust 代码编译到 WebAssembly 中，并简要介绍仅使用 JavaScript 将其直接加载到网页中的方法。如果你想在家继续，请确保你已经安装了 Rust 和 wasm32-unknown-unknown 目标：

```
rustup target add wasm32-unknown-unknown
```

我们将从与三种桌面网络浏览器（Chrome、Firefox 和 Safari）的兼容性角度来研究这些加载方法。我将咨询非常有用的 Can I use 网站以获取此信息。

准备好？好吧，我们走吧！



## # WebAssembly

https://caniuse.com/wasm

- Chrome 57：2017 年 3 月 9 日
- 火狐 52：2017 年 3 月 7 日
- Safari 11：2017 年 9 月 19 日

如果浏览器不支持它，那么尝试在浏览器中加载 WebAssembly 是没有意义的。但是，如果确实如此，我们通常可以假设存在其他事物，例如箭头函数，这是方便的。

## # WebAssembly.instantiate

此方法使用 WebAssembly.instantiate，所有支持 WebAssembly 的 Chrome、Firefox 和 Safari 版本都支持该方法。

我们将创建一个新的 Rust 项目，让 JavaScript 调用 Rust 主函数，然后调用 JavaScript 定义的 log_number 函数，然后让 JavaScript 调用另一个名为 add 的 Rust 函数：

```bash
cargo new wasm-instantiate
```

添加具有以下内容的文件：

```rust
// wasm-instantiate/src/main.rs:
extern "C" {
    pub fn log_number(number: u32);
}

fn main() {
    unsafe {
        log_number(42);
    }
}

#[no_mangle]
pub extern "C" fn add(a: u32, b: u32) -> u32 {
    a + b
}
```

```html
<!--wasm-instantiate/index.html:-->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Rust WASM Demo</title>
  </head>
  <body>
    <script>
      let imports = {
        env: {
          log_number: (number) => console.log(`Number from Rust: ${number}`)
        }
      };
      fetch('target/wasm32-unknown-unknown/release/wasm-instantiate.wasm')
        .then((response) => response.arrayBuffer())
        .then((bytes) => WebAssembly.instantiate(bytes, imports))
        .then((result) => {
          result.instance.exports.main();
          const sum = result.instance.exports.add(1, 2);
          console.log(`1 + 2 = ${sum}`);
        });
    </script>
  </body>
</html>
```

从 Rust 代码构建 WebAssembly blob：

```
cargo build --release --target=wasm32-unknown-unknown
```

启动本地 Web 服务器（在 Ubuntu Linux 中使用 python3 -m http.server 工作）并在浏览器中访问 index.html 页面。您应该在 JavaScript 控制台中看到以下内容：

```
Number from Rust: 42
1 + 2 = 3
```

这里发生的情况是浏览器获取了 WebAssembly blob，然后将其转换为 ArrayBuffer 并输入 WebAssembly.instantiate。然后可以使用结果的实例字段来调用 Rust 定义的 main 和 add 函数。不知道为什么 main 可以在没有 #[no_mangle] 和 pub extern "C" 的情况下在 add 需要它时逃脱。

使用 WebAssembly.instantiate 的最大好处是它可以在几乎所有支持 WebAssembly 的浏览器中运行。但是，有一个缺点：

> 警告：此方法不是获取和实例化 wasm 模块的最有效方法。如果可能的话，您应该使用较新的 WebAssembly.instantiateStreaming() 方法，该方法直接从原始字节码中一步获取、编译和实例化模块，因此不需要转换为 ArrayBuffer。
>
> [WebAssembly.instantiate() - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/instantiate)

这将我们带到了我们的下一个 WebAssembly 加载方法......

## # WebAssembly.instantiateStreaming

https://caniuse.com/mdn-javascript_builtins_webassembly_instantiatestreaming

- Chrome 61：2017 年 9 月 5 日
- 火狐 58：2018 年 1 月 23 日
- Safari 15：2021 年 9 月 20 日（！！！）

这种方法与使用 WebAssembly.instantiate 几乎相同，但 JavaScript 中的 fetch 块看起来像这样：

```javascript
fetch('target/wasm32-unknown-unknown/release/wasm-instantiate.wasm')
  .then((response) => WebAssembly.instantiateStreaming(response, imports))
  .then((result) => {
    result.instance.exports.main();
    const sum = result.instance.exports.add(1, 2);
    console.log(`1 + 2 = ${sum}`);
  });
```

也就是说，WebAssembly.instantiateStreaming 替换了 arrayBuffer 和 WebAssembly.instantiate 调用。上一节的引文中描述了这样做的好处。

Safari 花了四年的时间来支持这一点，而不是普通的 WebAssembly.instantiate！

## # wasm-bindgen --target 无模块

此方法使用异步函数，这些函数在所有支持 WebAssembly 的 Chrome、Firefox 和 Safari 版本中都受支持。

到目前为止，我们一直在编译和使用来自 JavaScript 的原始 WebAssembly。正如你可能已经注意到，呃，没有野心的代码示例，JavaScript 可以通过数字与 WebAssembly 进行通信，查看它的内存，并且……别无他法。能够在 JavaScript 和 WebAssembly 之间来回发送诸如字符串之类的更大的东西会很好。

输入 wasm-bindgen。它允许我们编写函数来接受 Rust 中的字符串和对象之类的东西，并直接在 JavaScript 端调用它们。具体来说，我们需要 wasm-bindgen 命令行实用程序：

```
cargo install wasm-bindgen-cli
```

现在从一个新的 Rust 项目开始；我们将从 wasm-bindgen 指南中抄袭：

```
cargo new --lib no-modules
```

```toml
# no-modules/Cargo.toml:
[package]
name = "no-modules"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["cdylib"]

[dependencies]
wasm-bindgen = "0.2.82"

[dependencies.web-sys]
version = "0.3.59"
features = [
  'Document',
  'Element',
  'HtmlElement',
  'Node',
  'Window',
]

```

```rust
// no-modules/src/lib.rs:
use wasm_bindgen::prelude::*;

#[wasm_bindgen(start)]
pub fn main() -> Result<(), JsValue> {
    let window = web_sys::window().expect("window");
    let document = window.document().expect("document in window");
    let body = document.body().expect("body in document");

    let val = document.create_element("p")?;
    val.set_inner_html("Hello from Rust!");

    body.append_child(&val)?;

    Ok(())
}

#[wasm_bindgen]
pub fn add(a: u32, b: u32) -> u32 {
    a + b
}
```



使用 cargo 编译它：

```
cargo build --release --target=wasm32-unknown-unknown
```

在 target/wasm32-unknown-unknown/release/no_modules.wasm 中生成的 WebAssembly blob不知道为什么 cargo 在这里将包名称中的破折号转换为下划线，但在以前的方法中没有。需要通过 wasm-bindgen 工具运行：

```
wasm-bindgen target/wasm32-unknown-unknown/release/no_modules.wasm \
    --out-dir .                                                    \
    --target no-modules                                            \
    --no-typescript
```

这应该会生成我们的网页将加载的 no_modules.js 文件，以及 no_modules.js 将依次加载的 no_modules_bg.wasm 文件。接下来是网页本身。

```html
<!--no-modules/index.html:-->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Rust WASM Demo</title>
  </head>
  <body>
    <script src="no_modules.js"></script>
    <script>
      const { add } = wasm_bindgen;

      async function run() {
        await wasm_bindgen('./no_modules_bg.wasm');
        const sum = add(1, 2);
        console.log(`1 + 2 = ${sum}`);
      }

      run();
    </script>
  </body>
</html>
```



加载它应该显示“Hello from Rust！”在浏览器中，在 JavaScript 控制台中如下：

```
1 + 2 = 3
```

在 <script> 标记中加载 no_modules.js 文件会创建一个全局 wasm_bindgen 变量，该变量既是函数又是具有属性的对象。将 wasm_bindgen 作为函数调用就像调用 Rust 中的 main 函数一样，因为它是用 #[wasm_bindgen(start)] 注释的。其他仅使用 #[wasm_bindgen] 注释的函数，例如我们的 add Rust 函数，作为 wasm_bindgen 对象的属性存在。

## # wasm-bindgen --target web

https://caniuse.com/es6-module

- Chrome 61：2017 年 9 月 5 日
- Firefox 60：2018 年 5 月 9 日
- Safari 11：2017 年 9 月 19 日

这种形式的 WebAssembly 加载使用了 <script type="module">。您可能已经猜到了，这次我们将使用 wasm-bindgen 工具来生成 Web 浏览器将加载的模块。

开始一个新的 Rust 项目：

```
cargo new --lib web
```

```toml
# web/Cargo.toml:
[package]
name = "web"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["cdylib"]

[dependencies]
wasm-bindgen = "0.2.82"

[dependencies.web-sys]
version = "0.3.59"
features = [
    'Document',
    'Element',
    'HtmlElement',
    'Node',
    'Window',
]
```



web/src/lib.rs 文件与 wasm-bindgen --target no-modules 部分中的 no-modules/src/lib.rs 相同，因此现在将其复制过来。

以相同的方式构建 Rust 代码：

```
cargo build --release --target=wasm32-unknown-unknown
```

我们将再次使用 wasm-bindgen 工具，但这次我们将通过 --target web 来创建一个模块：

```
wasm-bindgen target/wasm32-unknown-unknown/release/web.wasm \
    --out-dir .                                             \
    --target web                                            \
    --no-typescript
```

同样，我们得到 web.js 和 web_bg.wasm 文件。我们想在我们的网页中加载 web.js。

```html
<!--web/index.html:-->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Rust WASM Demo</title>
  </head>
  <body>
    <script type="module">
      import init, { add } from './web.js';

      async function run() {
        await init();
        const sum = add(1, 2);
        console.log(`1 + 2 = ${sum}`);
      }

      run();
    </script>
  </body>
</html>
```

运行本地 Web 服务器并在 Web 浏览器中查看它应该会再次显示“Hello from Rust！”以及 JavaScript 控制台中的以下内容：

```
1 + 2 = 3
```

web.js 现在是一个模块，因此 init 是带有 #[wasm_bindgen(start)] 注释的主要 Rust 函数的句柄，并且按预期导出了带有 #[wasm_bindgen] 注释的添加 Rust 函数。

## # 具有顶层等待的模块

https://caniuse.com/mdn-javascript_operators_await_top_level

- Chrome 89：2021 年 3 月 1 日（！！！）
- Firefox 89：2021 年 6 月 1 日（！！！）
- Safari 15：2021 年 9 月 20 日（！！！）

这是对网页中 <script type="module"> 中的 JavaScript 代码的轻微调整：

```javascript
import init, { add } from './web.js';
await init();
const sum = add(1, 2);
console.log(`1 + 2 = ${sum}`);
```

这节省了一些输入，但需要在 JavaScript 顶层支持 await，而在 2017 年和 2021 年之间停留 3-4 年的浏览器不支持该功能。

## ＃ 结论

如果你只需要加载原始 WebAssembly，WebAssembly.instantiateStreaming 只比 WebAssembly.instantiate 更新几个月，除了 Safari，它滞后几年。

对于 wasm-bindgen 提供的增强功能，--target no-modules 具有最大的兼容性，而--target web 仅更新数月。高层等待支持有很大的多年差距；使用它，后果自负。