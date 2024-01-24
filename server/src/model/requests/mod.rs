use serde::Deserialize;

pub mod book;
pub mod game;
pub mod post;

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PaginationParam {
    pub order_by: Option<OrderBy>,
    pub offset: Option<u16>,
    pub limit: Option<u16>,
}

#[derive(Deserialize)]
pub struct Pagination {
    pub order_by: OrderBy,
    pub offset: u16,
    pub limit: u16,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum OrderBy {
    Asc,
    Desc,
}

impl From<PaginationParam> for Pagination {
    fn from(pagination: PaginationParam) -> Self {
        Self {
            order_by: pagination.order_by.unwrap_or(OrderBy::Asc),
            offset: pagination.offset.unwrap_or(0),
            limit: pagination.limit.unwrap_or(20),
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
