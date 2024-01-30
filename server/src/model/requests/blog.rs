use serde::Deserialize;
use validator::Validate;

#[derive(Deserialize, Validate)]
pub struct AddBlogRequest {
    #[validate(length(min = 1, message = "Title an not be empty"))]
    #[validate(length(max = 200, message = "Title exceeding 200 characters."))]
    pub title: String,
    #[validate(length(min = 1, message = "Description an not be empty"))]
    #[validate(length(max = 200, message = "Description exceeding 200 characters."))]
    pub description: String,
    #[validate(length(min = 1, message = "Content an not be empty"))]
    #[validate(length(max = 1000, message = "Content exceeding 1000 characters."))]
    pub content: String,
    pub tags: Option<Vec<String>>,
}
