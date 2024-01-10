use serde::Deserialize;

#[derive(Deserialize)]
pub struct AddBookRequest {
    pub name: String,
    pub author: String,
    pub description: String,
}
