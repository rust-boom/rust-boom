use std::fs;

fn main() {
    let readme = fs::read("./readme.md").unwrap();

    let binding = String::from_utf8(readme).unwrap();
    let readme = binding.split("\n");

    for line in readme {
        let reg_link = regex::Regex::new(r"\[(.*)\]\((.*)\)").unwrap();

        let link = reg_link.captures(line);
        if let Some(link) = link {
            // check url is valid
            let url = link.get(2).unwrap().as_str();
            if !url.starts_with("http") {
                continue;
            }
            let res = reqwest::blocking::get(url);
            if let Err(e) = &res {
                println!("[{}] Error: {}", url, e);
            } else {
                // check if the link is valid
                let status = res.unwrap().status();
                if !status.is_success() {
                    println!("[{}] is invalid", url);
                }
            }
        }
    }
}
