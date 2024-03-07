use chrono::{DateTime, Utc};
use serde::Serialize;
use uuid::Uuid;

use crate::model::responses::HttpResponseConstErr;

#[derive(Serialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct PostDetails {
    pub id: Uuid,
    pub user_id: i64,
    pub user_name: String,
    pub user_avatar: String,
    pub content: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub is_liked: Option<bool>,
    pub likes: i64,
    pub comments: i64,
    pub created_at: DateTime<Utc>,
}

pub const NOT_AUTH_DEL: HttpResponseConstErr = HttpResponseConstErr {
    code: "POST_001",
    msg: "Not Authorized To Delete",
};

pub const NOT_AUTH_EDIT: HttpResponseConstErr = HttpResponseConstErr {
    code: "POST_002",
    msg: "Not Authorized To Edit",
};

pub const NOT_FOUND: HttpResponseConstErr = HttpResponseConstErr {
    code: "POST_003",
    msg: "Post Not Found",
};
