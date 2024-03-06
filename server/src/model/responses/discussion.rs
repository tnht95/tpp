use chrono::{DateTime, Utc};
use serde::Serialize;
use uuid::Uuid;

use crate::model::responses::HttpResponseConstErr;

#[derive(Serialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct DiscussionDetails {
    pub id: Uuid,
    pub user_id: i64,
    pub user_name: String,
    pub user_avatar: String,
    pub game_id: Uuid,
    pub title: String,
    pub comments: i64,
    pub likes: i64,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub is_liked: Option<bool>,
    pub content: String,
    pub created_at: DateTime<Utc>,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct DiscussionSummary {
    pub id: Uuid,
    pub user_name: String,
    pub title: String,
    pub created_at: DateTime<Utc>,
}

pub const NOT_FOUND: HttpResponseConstErr = HttpResponseConstErr {
    code: "DISCUSSION_001",
    msg: "Discussion Not Found",
};
pub const INVALID_GAME: HttpResponseConstErr = HttpResponseConstErr {
    code: "DISCUSSION_002",
    msg: "Invalid Game",
};
