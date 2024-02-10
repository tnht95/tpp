use chrono::{DateTime, Utc};
use serde::Serialize;
use uuid::Uuid;

use crate::model::responses::HttpResponseConstErr;

#[derive(Serialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct PostDetails {
    pub id: Uuid,
    pub author_id: i64,
    pub author_name: String,
    pub author_avatar: String,
    pub content: String,
    pub likes: i64,
    pub comments: i64,
    pub created_at: DateTime<Utc>,
}

pub const NOT_AUTH_DEL: HttpResponseConstErr = HttpResponseConstErr {
    code: "POST_001",
    msg: "Not authorized to delete",
};

pub const NOT_AUTH_EDIT: HttpResponseConstErr = HttpResponseConstErr {
    code: "POST_002",
    msg: "Not authorized to edit",
};
