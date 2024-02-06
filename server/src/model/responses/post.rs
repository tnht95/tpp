use chrono::{DateTime, Utc};
use serde::Serialize;
use uuid::Uuid;

use crate::model::responses::HttpResponseConstErr;

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct PostDetails {
    pub id: Uuid,
    pub author_id: i64,
    pub author_name: String,
    pub author_avatar: String,
    pub content: String,
    pub likes: i16,
    pub comments: i16,
    pub created_at: DateTime<Utc>,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct PostContent {
    pub id: Uuid,
    pub content: String,
}

pub const NOT_AUTH_DEL: HttpResponseConstErr = HttpResponseConstErr {
    code: "POST_001",
    msg: "Not authorized to delete",
};

pub const NOT_AUTH_EDIT: HttpResponseConstErr = HttpResponseConstErr {
    code: "POST_002",
    msg: "Not authorized to edit",
};
