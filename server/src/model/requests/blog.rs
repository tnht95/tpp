use serde::Deserialize;
use validator::Validate;

use super::validate_tags;

#[derive(Deserialize, Validate)]
pub struct AddBlogRequest {
    #[validate(length(min = 1, message = "Title can not be empty"))]
    #[validate(length(max = 200, message = "Title exceeding 200 characters."))]
    pub title: String,

    #[validate(length(min = 1, message = "Description can not be empty"))]
    #[validate(length(max = 200, message = "Description exceeding 200 characters."))]
    pub description: String,

    #[validate(length(min = 1, message = "Content can not be empty"))]
    #[validate(length(max = 2000, message = "Content exceeding 2000 characters."))]
    pub content: String,

    #[validate(custom(function = "validate_tags"))]
    pub tags: Option<Vec<String>>,
}

pub type EditBlogRequest = AddBlogRequest;
