use serde::Deserialize;
use validator::{Validate, ValidationError};

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

    #[validate(custom(function = "validate_tags"))]
    pub tags: Option<Vec<String>>,
}

fn validate_tags(tags: &Vec<String>) -> Result<(), ValidationError> {
    if tags.len() > 5 {
        return Err(ValidationError::new("invalid_tag_size"));
    }

    let has_spacing = tags.iter().any(|t| t.starts_with(' ') || t.ends_with(' '));
    if has_spacing {
        return Err(ValidationError::new("invalid_tag_spacing"));
    }

    let is_empty = tags.iter().any(|t| t.is_empty());
    if is_empty {
        return Err(ValidationError::new("invalid_tag_empty"));
    }

    let too_long = tags.iter().any(|t| t.len() > 20);
    if too_long {
        return Err(ValidationError::new("invalid_tag_too_long"));
    }

    Ok(())
}
