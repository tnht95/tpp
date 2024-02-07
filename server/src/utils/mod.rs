use std::collections::HashSet;

pub mod github;
pub mod jwt;

pub fn clean_duplicate(str: Option<Vec<String>>) -> Vec<String> {
    let str = str.unwrap_or_default();
    str.iter()
        .map(|s| s.to_lowercase())
        .collect::<HashSet<String>>()
        .into_iter()
        .collect()
}
