use serde::Deserialize;
use validator::Validate;

#[derive(Deserialize, Validate)]
pub struct AddPostRequest {
    #[validate(length(min = 1, message = "Can not be empty"))]
    pub content: String,
}
