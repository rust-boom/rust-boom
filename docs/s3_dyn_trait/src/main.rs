use std::fmt::Debug;

trait Element {}

trait IElement: Element + Debug {}

#[derive(Debug)]
struct DivElement {}

impl Element for DivElement {}

#[derive(Debug)]
struct AElement {}

impl Element for AElement {}

#[derive(Debug)]
struct Render {
    elements: Vec<Box<dyn IElement>>,
}

fn main() {
    let render = Render {
        elements: Vec::new(),
    };
    println!("{:?}", render);
}
