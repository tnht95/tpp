use chrono::{DateTime, Utc};
use serde::Serialize;
use uuid::Uuid;

use crate::model::responses::HttpResponseConstErr;

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct CommentDetails {
    pub id: Uuid,
    pub user_id: i64,
    pub user_name: String,
    pub user_avatar: String,
    pub content: String,
    pub likes: i64,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub is_liked: Option<bool>,
    pub created_at: DateTime<Utc>,
}

pub const NOT_AUTH_DEL: HttpResponseConstErr = HttpResponseConstErr {
    code: "CMT_001",
    msg: "Not Authorized To Delete",
};

pub const NOT_AUTH_EDIT: HttpResponseConstErr = HttpResponseConstErr {
    code: "CMT_002",
    msg: "Not Authorized To Edit",
};
