use serde::Deserialize;

#[derive(Deserialize)]
pub struct AddGameRequest {
    pub name: String,
    pub author_id: i64,
    pub author_name: String,
    pub url: Option<String>,
    pub avatar_url: Option<String>,
    pub about: Option<String>,
    pub info: Option<String>,
    pub tags: Option<Vec<String>>,
    pub rom: String,
}
