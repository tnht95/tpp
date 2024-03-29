use serde::Deserialize;
use validator::Validate;

#[derive(Deserialize, Validate)]
#[serde(rename_all = "camelCase")]
pub struct AddDiscussionRequest {
    #[validate(length(min = 1, message = "Can not be empty"))]
    #[validate(length(max = 100, message = "Too long, exceeding 100 characters."))]
    pub title: String,
    #[validate(length(min = 1, message = "Can not be empty"))]
    #[validate(length(max = 1000, message = "Too long, exceeding 1000 characters."))]
    pub content: String,
}

pub type EditDiscussionRequest = AddDiscussionRequest;
