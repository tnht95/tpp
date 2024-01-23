use serde::Deserialize;

#[derive(Deserialize)]
pub struct AddPostRequest {
    pub content: String,
}
