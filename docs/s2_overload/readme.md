# 一文让你了解在 Rust 中实现方法重载模式

重载是一种可以不用为了对不同的参数类型或参数个数，而写多个函数。
基本在很多编程语言里都支持重载的这种特性，那 Rust 它支持吗？

今天咱们就探索一下用 Rust 来实现重载。

## 实现

我们都知道 Rust 中我们可以为一个类型实现多种不同的 trait，那我们能不能用 trait 来实现重载呢？

我们尝试一下写一个 random 模块，代码是这样的：

```rust
mod random {
    use rand::{thread_rng, Rng};

    pub struct Random;

    pub trait Gen1 {
        fn gen() -> i32;
    }

    impl Gen1 for Random {
        fn gen() -> i32 {
            let mut rng = thread_rng();
            rng.gen_range(0..100)
        }
    }

    pub trait Gen2 {
        fn gen(end: u32) -> i32;
    }

    impl Gen2 for Random {
        fn gen(end: u32) -> i32 {
            let mut rng = thread_rng();
            rng.gen_range(0..(end as i32))
        }
    }
}

```

我们定义了一个 Random 类型，并且为 Random 实现了 Gen1 和 Gen2 两个自定义的 trait。

Gen1 是没有参数的，默认生成一个 0-100 的整数。

Gen2 是有一个 end 参数，生成 0-end 的整数。

然后我们这样去使用：

```rust
use random::Random;
fn main() {
    println!("hello rust boom!!");
    {
        use random::Gen1;
        println!("{:?}", Random::gen());
    }
    {
        use random::Gen2;
        println!("{:?}", Random::gen(12));
    }
}
```

成功了，我们导入 trait 后可以用不同的方式使用 gen 这个方法，不过这里有个需要注意的地方就是不能全局同时导入 Gen1 和 Gen2，因为 Rust 编译器他不知道当前使用的是 Gen1 还是 Gen2 的类型。

上面的实现方法，在使用的时候还是比较麻烦的，但是也是一种可行方式

在 rust 除了这样去实现，还有一种方式是给方法别名：

```rust
println!("{:?}", Random::gen2());
println!("{:?}", Random::gen3(12));
```

这种是比较常见的方式，具体童鞋们想怎么使用可以自己衡量。

到这里我们使用 trait 的实现了重载的这种特性，但是从[官方文档](https://link.zhihu.com/?target=https%3A//users.rust-lang.org/t/is-it-possible-to-specialize-hashmap-index-for-copy-types/7750/5%3Fu%3Dleodasvacas)来看 Rust 好像是不太推荐使用重载的：

1. 官方觉得没什么用，因为你总是可以再起个新名字

2. 而且官方觉得这玩意不是啥好东西，因为名字相同但是签名和实现不同的函数就应该有不同的名字

3. 然后重载意味着泛型里需要做偏特化，这玩意实现起来不那么简单而且也不容易分析（想想 C++的偏特化地狱）

不过我们也不必纠结，哪种方式适合就用哪种。

## 结语

最后欢迎大家来关注 [rust-boom/rust-boom: rust awesome. (github.com)](https://github.com/rust-boom/rust-boom)仓库，这里会汇总 rust 各种中文资源、框架、库、软件等欢迎来 star，您的 star 就是我创作和维护的动力。
