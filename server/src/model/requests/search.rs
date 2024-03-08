use serde::Deserialize;
use validator::Validate;

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum Category {
    Games,
    Blogs,
    Users,
    Posts,
}

#[derive(Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub enum TagCategory {
    Games,
    Blogs,
}

#[derive(Deserialize, Validate)]
#[serde(rename_all = "camelCase")]
pub struct SearchPagination {
    #[validate(length(min = 1, message = "Can not be empty"))]
    #[validate(length(max = 35, message = "Too long, exceeding 35 characters."))]
    pub keyword: String,
    pub category: Option<Category>,
    pub offset: Option<i64>,
    pub limit: Option<i64>,
}
pub struct SearchPaginationInternal {
    pub keyword: String,
    pub category: Option<Category>,
    pub offset: i64,
    pub limit: i64,
}
impl From<SearchPagination> for SearchPaginationInternal {
    fn from(pagination: SearchPagination) -> Self {
        Self {
            keyword: pagination.keyword.replace('%', "\\%").replace('_', "\\_"),
            category: pagination.category,
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
pub struct TagSearchPagination {
    pub category: Option<TagCategory>,
    pub offset: Option<i64>,
    pub limit: Option<i64>,
}

pub struct TagSearchPaginationInternal {
    pub category: Option<TagCategory>,
    pub offset: i64,
    pub limit: i64,
}
impl From<TagSearchPagination> for TagSearchPaginationInternal {
    fn from(pagination: TagSearchPagination) -> Self {
        Self {
            category: pagination.category,
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
