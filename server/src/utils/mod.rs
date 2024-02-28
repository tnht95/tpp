use std::collections::HashSet;

pub mod github;
pub mod jwt;

pub fn clean_duplicate(str: Option<Vec<String>>) -> Vec<String> {
    str.unwrap_or_default()
        .iter()
        .map(|s| s.to_string())
        .collect::<HashSet<String>>()
        .into_iter()
        .collect()
}
