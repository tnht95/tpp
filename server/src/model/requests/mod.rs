use serde::Deserialize;
use uuid::Uuid;
use validator::ValidationError;

pub mod blog;
pub mod comment;
pub mod discussion;
pub mod game;
pub mod like;
pub mod post;
pub mod search;
pub mod vote;

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Pagination {
    pub offset: Option<i64>,
    pub limit: Option<i64>,
}
pub struct PaginationInternal {
    pub offset: i64,
    pub limit: i64,
}
impl From<Pagination> for PaginationInternal {
    fn from(pagination: Pagination) -> Self {
        Self {
            offset: match pagination.offset.unwrap_or(0) {
                offset if offset < 0 => 0,
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

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PaginationWithTarget {
    pub target_id: Option<Uuid>,
    pub offset: Option<i64>,
    pub limit: Option<i64>,
}
pub struct PaginationWithTargetInternal {
    pub target_id: Uuid,
    pub offset: i64,
    pub limit: i64,
}
impl From<PaginationWithTarget> for PaginationWithTargetInternal {
    fn from(pagination: PaginationWithTarget) -> Self {
        Self {
            target_id: pagination.target_id.unwrap_or(Uuid::nil()),
            offset: match pagination.offset.unwrap_or(0) {
                offset if offset < 0 => 0,
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

fn validate_tags(tags: &[String]) -> Result<(), ValidationError> {
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
