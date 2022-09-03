use enigo::{Enigo, KeyboardControllable, MouseButton, MouseControllable};

fn main() {
    let mut enigo = Enigo::new();

    enigo.mouse_move_to(500, 200);
    enigo.mouse_click(MouseButton::Left);
    enigo.key_sequence_parse("{+CTRL}a{-CTRL}{+SHIFT}Hello World{-SHIFT}");
}
