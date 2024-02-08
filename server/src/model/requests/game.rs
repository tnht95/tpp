use std::fmt;

use serde::Deserialize;
use validator::{Validate, ValidationError};

use super::validate_tags;

#[derive(Deserialize, Validate)]
#[serde(rename_all = "camelCase")]
pub struct AddGameRequest {
    #[validate(length(min = 1, message = "Can not be empty"))]
    #[validate(length(max = 40, message = "Too long, exceeding 40 characters."))]
    pub name: String,

    #[validate(length(max = 255, message = "Too long, exceeding 255 characters."))]
    pub url: Option<String>,

    #[validate(length(max = 255, message = "Too long, exceeding 255 characters."))]
    pub avatar_url: Option<String>,

    #[validate(length(max = 255, message = "Too long, exceeding 255 characters."))]
    pub about: Option<String>,

    #[validate(length(max = 2000, message = "Too long, exceeding 2000 characters."))]
    pub info: Option<String>,

    #[validate(custom(function = "validate_tags"))]
    pub tags: Option<Vec<String>>,
}

pub type EditGameRequest = AddGameRequest;

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum OrderBy {
    Asc,
    Desc,
}
impl std::fmt::Display for OrderBy {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            OrderBy::Asc => write!(f, "asc"),
            OrderBy::Desc => write!(f, "desc"),
        }
    }
}
#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum OrderField {
    CreatedAt,
    Name,
    Votes,
}
impl fmt::Display for OrderField {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            OrderField::CreatedAt => write!(f, "created_at"),
            OrderField::Votes => write!(f, "up_votes"),
            OrderField::Name => write!(f, "name"),
        }
    }
}

#[derive(Deserialize, Validate)]
#[serde(rename_all = "camelCase")]
#[validate(schema(function = "validate_order", message = "Invalid order"))]
pub struct GamePagination {
    pub author_id: Option<i64>,
    pub tag: Option<String>,
    pub order_field: Option<OrderField>,
    pub order_by: Option<OrderBy>,
    pub offset: Option<i64>,
    pub limit: Option<i64>,
}
pub struct GamePaginationInternal {
    pub author_id: Option<i64>,
    pub tag: Option<String>,
    pub order_field: OrderField,
    pub order_by: OrderBy,
    pub offset: i64,
    pub limit: i64,
}
impl From<GamePagination> for GamePaginationInternal {
    fn from(pagination: GamePagination) -> Self {
        Self {
            author_id: pagination.author_id,
            tag: pagination.tag,
            order_field: pagination.order_field.unwrap_or(OrderField::CreatedAt),
            order_by: pagination.order_by.unwrap_or(OrderBy::Asc),
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
fn validate_order(q: &GamePagination) -> Result<(), ValidationError> {
    if (q.order_field.is_some() && q.order_by.is_none())
        || (q.order_field.is_none() && q.order_by.is_some())
    {
        return Err(ValidationError::new("invalid_order"));
    }
    Ok(())
}
