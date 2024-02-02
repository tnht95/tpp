use serde::Deserialize;
use validator::ValidationError;

pub mod blog;
pub mod book;
pub mod comment;
pub mod game;
pub mod post;

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Pagination {
    pub order_by: Option<OrderBy>,
    pub offset: Option<i16>,
    pub limit: Option<i16>,
}

#[derive(Deserialize)]
pub struct PaginationInternal {
    pub order_by: OrderBy,
    pub offset: i16,
    pub limit: i16,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum OrderBy {
    Asc,
    Desc,
}

impl From<Pagination> for PaginationInternal {
    fn from(pagination: Pagination) -> Self {
        Self {
            order_by: pagination.order_by.unwrap_or(OrderBy::Asc),
            offset: match pagination.offset.unwrap_or(0) {
                offset if offset < 0 => 0,
                offset if offset > 20 => 20,
                offset => offset,
            },
            limit: match pagination.limit.unwrap_or(20) {
                limit if limit < 1 => 1,
                limit if limit > 20 => 20,
                offset => offset,
            },
        }
    }
}

impl std::fmt::Display for OrderBy {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            OrderBy::Asc => write!(f, "asc"),
            OrderBy::Desc => write!(f, "desc"),
        }
    }
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
