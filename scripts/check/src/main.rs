use std::{fs, vec};

fn main() {
    let readme_content = fs::read("./readme.md").unwrap();

    let readme_content = String::from_utf8(readme_content).unwrap();
    let readme = readme_content
        .split("\n")
        .enumerate()
        .map(|(index, line)| (index, line))
        .collect::<Vec<(usize, &str)>>();
    let mut res = vec!["| 导航 | 徽章 |".to_string(), "| :--- | :--- |".to_string()];
    let mut t = [String::new(), String::new(), String::new(), String::new()];

    for (index, line) in readme.iter() {
        let head = regex::Regex::new(r"^(#*) (.*)$").unwrap();
        if let Some(caps) = head.captures(line) {
            if let Some(cap) = caps.get(1) {
                let level = cap.as_str().len();
                let title = caps.get(2).unwrap().as_str();
                // println!("{} {}", level, title);
                if level >= 2 {
                    if level > 2 {
                        t[level - 1] = title.to_string();
                    } else {
                        t[level - 1] = title.to_string();
                        t[level] = String::new();
                        t[level + 1] = String::new();
                    }
                    let c = t
                        .iter()
                        .filter(|x| x.len() > 0)
                        .map(|x| format!("[{}](#{})", x, x.to_lowercase().replace(" ", "-")))
                        .collect::<Vec<String>>()
                        .join(" / ");
                    let next_line = readme.get(index + 2).unwrap();
                    let reg_img = regex::Regex::new(r"^!\[.*\]\((.*)\)").unwrap();
                    let table = if reg_img.is_match(next_line.1) {
                        format!("| {} | {} |", c, next_line.1)
                    } else {
                        format!("| {} |  |", c)
                    };
                    res.push(table);
                }
            }
        }
    }

    // <!-- Catalogs-Start --> {res} <!-- Catalogs-End -->
    let reg = regex::RegexBuilder::new(r"<!-- Catalogs-Start -->([\s\S]*?)<!-- Catalogs-End -->")
        .multi_line(true)
        .build()
        .unwrap();
    if let Some(caps) = reg.captures(&readme_content) {
        println!("{}", caps.get(1).unwrap().as_str());
    }

    let readme_content = reg.replace_all(
        &readme_content,
        format!(
            "<!-- Catalogs-Start -->\n{}\n\n<!-- Catalogs-End -->",
            res.join("\n")
        )
        .as_str(),
    );

    fs::write("./readme.md", readme_content.as_bytes()).unwrap();
}
