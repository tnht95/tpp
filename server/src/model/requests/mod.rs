use serde::Deserialize;

pub mod blog;
pub mod book;
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
