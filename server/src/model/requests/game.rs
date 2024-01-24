use std::fmt;

use serde::Deserialize;

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
pub enum OrderField {
    Date,
    Name,
    Stars,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GameQuery {
    pub order_by: Option<OrderBy>,
    pub limit: Option<u16>,
    pub order_field: Option<OrderField>,
    pub author_id: Option<i64>,
    pub tag: Option<String>,
}

impl fmt::Display for OrderField {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            OrderField::Date => write!(f, "created_at"),
            OrderField::Stars => write!(f, "stars"),
            OrderField::Name => write!(f, "name"),
        }
    }
}
