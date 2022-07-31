# 一篇文章让你彻底理解 Rust 的 Move、Copy、Clone

## 问题

今天我在开发中遇到这样一个问题：

```rust
fn main() {
    demo1();
    demo2();
}

fn demo2() {
    let a = 1024;
    let b = a;
    println!("{:?} {:?}", a, b);
}

fn demo1() {
    let a = String::from("hello");
    let b = a;

    println!("{:?} {:?}", a, b)
}

```

运行结果：

```bash
   Compiling rust-boom v0.1.0 (/Users/wmc/workspace/rust-boom)
error[E0382]: borrow of moved value: `a`
  --> examples/move_copy_clone.rs:16:27
   |
13 |     let a = String::from("hello");
   |         - move occurs because `a` has type `String`, which does not implement the `Copy` trait
14 |     let b = a;
   |             - value moved here
15 | 
16 |     println!("{:?} {:?}", a, b)
   |                           ^ value borrowed here after move
   |
   = note: this error originates in the macro `$crate::format_args_nl` (in Nightly builds, run with -Z macro-backtrace for more info)

For more information about this error, try `rustc --explain E0382`.
error: could not compile `rust-boom` due to previous error
```

程序运行出错了，翻译一下就是`a被move了，但是你又访问了a`，确实这个报错没有毛病，在rust中对内存的管理是靠`所有权`机制进行的，但是问题是为什么demo2确可以这样做？下面我们来讨论一下这个问题。

## 解析

在rust中有个非常重要的几个概念这里先说一下：

首先是所有权，什么是所有权，比如在生活中你拥有你的手机的所有权，我们可以去使用自己的手机，也可以扔掉这个手机。而在rust中也是如此，在rust中所有权表示我们对一个值的使用、修改、销毁的控制权利。

也就是说当我们将一个值("hello")赋值给一个变量(a)，这个时候这个值("hello")的所有权就是变量(a)，我们可以通过这个变量(a)来访问值("hello")，也可以将这个值("hello")转移给变量(b)，这时候a就无法在次访问值("hello")，这相当于是你把手机给了另一个人，你就无权在使用这个手机，这也叫所有权转移。

上面的错误我们也知道了为什么，问题就到这结束了？显然没有下面还有这么多文字呢。

真正的问题是demo2，为什么他可以这样做呢？

这里就引出了一个特殊的trait `Copy`，这个`Copy`是什么呢，通过官方的解释我们得知（[Copy in std::marker - Rust (rustwiki.org)](https://rustwiki.org/zh-CN/std/marker/trait.Copy.html)）：`只需复制位即可复制其值的类型。`

这句话的意思就是，如果我们这个类型实现了Copy那么在赋值的时候这个行为会变成复制，不过这里只进行栈上的复制，下面我们写个demo看看：

```rust
// demo3-1
#[derive(Debug, Clone, Copy)] // 注释掉可以看demo3的报错
struct MyData {
    value: i32,
}

fn demo3() {
    let a = MyData { value: 32 };
    let b = a;
    println!("{:?} {:?}", a, b);
}
```

> derive是为某个类型自动实现trait的宏。

确实如我们所愿程序顺利执行，当我们注释掉注解后发生了错误。到这里我们知道了如果为一个类型实现了Copy那么在赋值的时候这个行为会变成复制，而不是移动。

但是这里我们要知道如果想给一个类型实现Copy那么他的成员类型也必须都实现Copy，比如下面的代码MyData就会发生错误：

```rust
// demo3-2
#[derive(Debug, Clone, Copy)] // 注释掉可以看demo3的报错
struct MyData {
    value: i32,
    value2: Vec<i32>, // 这块发生了错误，String未实现Copy
}
```

> 提示：Copy是继承于Clone，所以在实现Copy的时候必须实现Clone。

这也是Rust的一种编程范式吧，有很多trait都是这样比如 Default 等。

假如我们真的想要成员变量有未实现Copy等类型但是我们又想这个类型可以复制，那该怎么做呢？

居然这个错误是因为value2没有实现Copy导致等，那我们尝试一下给Vec实现一下Copy看看能否解决。

```rust
// demo3-3
impl Copy for Vec<i32> {}
/**
 impl Copy for Vec<i32> {}
   | ^^^^^^^^^^^^^^--------
   | |             |
   | |             `Vec` is not defined in the current crate
   | impl doesn't use only types from inside the current crate
 */
```

代码写完了，但是还是发生了错误，翻译一下`当前模块中未定义Vec`，但是除了这个原因还有一个原因就是Vec实现了Drop，在rust中所有实现Drop的不能实现Copy，Drop是在一个变量脱离他的作用后会自动释放他所持有的资源，这里的资源指的是堆上的数据、TCP连接等，如果复制了这个变量，但是他只会复制栈上的数据，不会复制堆上的数据，这样会导致两个变量持有同一个资源，在释放的时候就会发生重复释放的问题。

所以这个方法也不行，但是我们非要实现这个需求呢？

我们可以使用引用的方式：

```rust
#[derive(Debug, Clone, Copy)] // 注释掉可以看demo3的报错
struct MyData<'a> {
    value: i32,
    value2: &'a Vec<i32>,
}

```

但实际上使用引用我们还得使用生命周期的方式，整个代码也不是很优雅，所以我们能不能使用比较优雅的方式呢，比如不用Copy，代码如下：

```rust
#[derive(Debug, Clone)]  // +-
struct MyData {
    value: i32,
    value2: Vec<i32>,
}

// impl Copy for Vec<i32> {}

fn demo3() {
    let a = MyData {
        value: 32,
        value2: vec![10, 11],
    };
    let b = a.clone(); // +-
    println!("{:?} {:?}", a, b);
}
```

使用clone的方式也是可以达到相似的效果，不过clone是进行了深度拷贝，也就是clone不止会复制栈上的数据，还会复制堆上的数据。

但是这还是不是很优雅而且还会有性能问题，我们可不可以用更好的方式呢？答案是有，代码如下：

```rust
fn demo3() {
    let a = MyData {
        value: 32,
        value2: vec![10, 11],
    };
    let b = &a; // +-
    println!("{:?} {:?}", a, b);
}
```

我们可以使用不可变借用的方式，这样不管是性能还是代码都是最优雅的，到这里基本已经完成了这篇文章的主题说明，大家可以去fork仓库来运行实例demo进行学习。

## 结论

- 如果一个数据想要存储在栈上，那这个数据的大小一定是确定的，并且我们能明确的在编程中得到这个大小。
- 对于大小未知的数据我们可以选择在堆中存储，在Rust中Vec、String、Box等都是将数据存储在堆中。
- Rust中变量的赋值的默认行为是Move，如果实现了Copy这个行为会变成按位复制，而大部分的基础数据类型都实现了Copy。
- Copy继承为Clone，所以我们为一个类型实现Copy的同时也要实现Clone。
- Copy与Drop是互斥的。

## 最后

欢迎大家来关注 [WumaCoder/rust-boom: rust awesome. (github.com)](https://github.com/WumaCoder/rust-boom) 仓库，这里会汇总rust各种中文资源、框架、库、软件等欢迎来star，您的star就是我创作和维护的动力。

## 引用

- [Copy in std::marker - Rust (rustwiki.org)](https://rustwiki.org/zh-CN/std/marker/trait.Copy.html)
- [Drop 释放资源 - Rust语言圣经(Rust Course)](https://course.rs/advance/smart-pointer/drop.html)
- [Why does Rust not allow the copy and drop traits on one type? - Stack Overflow](https://stackoverflow.com/questions/51704063/why-does-rust-not-allow-the-copy-and-drop-traits-on-one-type)

