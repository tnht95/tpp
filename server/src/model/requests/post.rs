use serde::Deserialize;
use validator::Validate;

#[derive(Deserialize, Validate)]
pub struct AddPostRequest {
    #[validate(length(min = 1, message = "Can not be empty"))]
    #[validate(length(max = 200, message = "Too long, exceeding 200 characters."))]
    pub content: String,
}

pub type EditPostRequest = AddPostRequest;
