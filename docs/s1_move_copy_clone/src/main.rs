fn main() {
    demo3();
}

#[derive(Debug, Clone)] // 注释掉可以看demo3的报错
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
    let b = &a;
    println!("{:?} {:?}", a, b);
}

fn demo2() {
    let a = 1024;
    let b = a;
    println!("{:?} {:?}", a, b);
}

fn demo1() {
    // let a = String::from("hello");
    // let b = a;

    // println!("{:?} {:?}", a, b)
}
