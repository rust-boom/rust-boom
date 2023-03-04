use std::{
    borrow::{Borrow, BorrowMut},
    cell::RefCell,
    ptr::NonNull,
    rc::{Rc, Weak},
};

fn main() {
    let p = Parent::new("parent");
    println!("p: {:?}", p);

    p.child.set_parent_name("new parent");

    println!("p: {:?}", p);

    let p2 = p.clone();

    println!("p: {:?}", p);
    println!("p2: {:?}", p2);

    p.set_name("new parent 2");

    println!("p: {:?}", p);
    println!("p2: {:?}", p2);

    p.child.set_parent_name("new parent");

    println!("p: {:?}", p);
    println!("p2: {:?}", p2);
}

#[derive(Debug)]
struct Parent {
    pub name: RefCell<String>,

    pub child: Child,
}

impl Parent {
    fn new(name: &str) -> Rc<Parent> {
        let p = Rc::new(Parent {
            name: RefCell::from(name.to_string()),
            child: Child::new("child"),
        });

        p.child.set_parent(Rc::downgrade(&p));
        p
    }

    fn set_name(&self, name: &str) {
        (*self.name.borrow_mut()) = name.to_string();
    }
}

#[derive(Debug)]
struct Child {
    name: String,
    parent: RefCell<Option<Weak<Parent>>>,
}

impl Child {
    fn new(name: &str) -> Child {
        Child {
            name: name.to_string(),
            parent: RefCell::from(None),
        }
    }

    fn set_parent(&self, parent: Weak<Parent>) {
        (*self.parent.borrow_mut()) = Some(parent);
    }

    fn set_parent_name(&self, name: &str) {
        if let Some(p) = self.parent.borrow().as_ref() {
            if let Some(p) = p.upgrade() {
                p.set_name(name);
            }
        }
    }
}

// log:
// p: Parent { name: RefCell { value: "parent" }, child: Child { name: "child", parent: RefCell { value: Some((Weak)) } } }
// p: Parent { name: RefCell { value: "new parent" }, child: Child { name: "child", parent: RefCell { value: Some((Weak)) } } }
// p: Parent { name: RefCell { value: "new parent" }, child: Child { name: "child", parent: RefCell { value: Some((Weak)) } } }
// p2: Parent { name: RefCell { value: "new parent" }, child: Child { name: "child", parent: RefCell { value: Some((Weak)) } } }
// p: Parent { name: RefCell { value: "new parent 2" }, child: Child { name: "child", parent: RefCell { value: Some((Weak)) } } }
// p2: Parent { name: RefCell { value: "new parent 2" }, child: Child { name: "child", parent: RefCell { value: Some((Weak)) } } }
// p: Parent { name: RefCell { value: "new parent" }, child: Child { name: "child", parent: RefCell { value: Some((Weak)) } } }
// p2: Parent { name: RefCell { value: "new parent" }, child: Child { name: "child", parent: RefCell { value: Some((Weak)) } } }
