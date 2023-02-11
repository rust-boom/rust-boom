use std::{borrow::Borrow, cell::RefCell, ptr::NonNull, rc::Rc};

fn main() {
    let p = Parent::new("parent");
    // println!("p: {:?}", p);

    let mut p = p.clone();
    p.borrow_mut().child.set_parent_name("new parent");
    // println!("p: {:?}", p);
}

#[derive(Debug)]
struct Parent {
    pub name: String,

    pub child: Child,
}

impl Parent {
    fn new(name: &str) -> Rc<RefCell<Parent>> {
        let p = Rc::new(RefCell::new(Parent {
            name: name.to_string(),
            child: Child::new("child"),
        }));

        p.clone().borrow_mut().child.set_parent(p.clone());
        p
    }

    fn set_name(&mut self, name: &str) {
        self.name = name.to_string();
    }
}

#[derive(Debug)]
struct Child {
    name: String,
    parent: Option<Rc<RefCell<Parent>>>,
}

impl Child {
    fn new(name: &str) -> Child {
        Child {
            name: name.to_string(),
            parent: None,
        }
    }

    fn set_parent(&mut self, parent: Rc<RefCell<Parent>>) {
        self.parent = Some(parent);
    }

    fn set_parent_name(&mut self, name: &str) {
        if let Some(parent) = &mut self.parent {
            parent.borrow_mut().set_name(name);
        }
    }
}
