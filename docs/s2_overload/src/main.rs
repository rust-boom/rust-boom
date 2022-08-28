use random::Random;
fn main() {
    println!("hello rust boom!!");
    {
        println!("{:?}", Random::gen2());
        println!("{:?}", Random::gen3(12));
    }
    {
        use random::Gen1;
        println!("{:?}", Random::gen());
    }
    {
        use random::Gen2;
        println!("{:?}", Random::gen(12));
    }
}

mod random {
    use rand::{thread_rng, Rng};

    pub struct Random;

    impl Random {
        pub fn gen2() -> i32 {
            let mut rng = thread_rng();
            rng.gen_range(0..100)
        }
        pub fn gen3(end: u32) -> i32 {
            let mut rng = thread_rng();
            rng.gen_range(0..(end as i32))
        }
    }

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
