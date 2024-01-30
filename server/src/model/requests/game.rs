use std::fmt;

use serde::Deserialize;
use validator::{Validate, ValidationError};

use crate::model::requests::OrderBy;

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AddGameRequest {
    pub name: String,
    pub author_id: i64,
    pub author_name: String,
    pub url: Option<String>,
    pub avatar_url: Option<String>,
    pub about: Option<String>,
    pub info: Option<String>,
    pub tags: Option<Vec<String>>,
    pub rom: String,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum OrderField {
    CreatedAt,
    Name,
    Stars,
}

#[derive(Deserialize, Validate)]
#[serde(rename_all = "camelCase")]
#[validate(schema(function = "validate_order", message = "Invalid order"))]
#[validate(schema(function = "validate_offset", message = "Invalid offset"))]
pub struct GameQuery {
    pub order_field: Option<OrderField>,
    pub order_by: Option<OrderBy>,
    pub limit: Option<i16>,
    pub author_id: Option<i64>,
    pub tag: Option<String>,
    pub offset: Option<i16>,
}

fn validate_order(q: &GameQuery) -> Result<(), ValidationError> {
    if (q.order_field.is_some() && q.order_by.is_none())
        || (q.order_field.is_none() && q.order_by.is_some())
    {
        return Err(ValidationError::new("invalid_order"));
    }
    Ok(())
}

fn validate_offset(q: &GameQuery) -> Result<(), ValidationError> {
    if q.offset.is_some() && q.limit.is_none() {
        return Err(ValidationError::new("invalid_offset"));
    }
    Ok(())
}

impl fmt::Display for OrderField {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            OrderField::CreatedAt => write!(f, "created_at"),
            OrderField::Stars => write!(f, "stars"),
            OrderField::Name => write!(f, "name"),
        }
    }
}
