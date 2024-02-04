use chrono::{DateTime, Utc};
use serde::Serialize;
use uuid::Uuid;
use validator::Validate;

use crate::model::responses::HttpResponseConstErr;

#[derive(Serialize, Validate)]
#[serde(rename_all = "camelCase")]
pub struct DiscussionResponse {
    pub id: Uuid,
    pub user_id: i64,
    pub user_name: String,
    pub user_avatar: String,
    pub game_id: Uuid,
    pub title: String,
    pub content: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

pub const NOT_FOUND: HttpResponseConstErr = HttpResponseConstErr {
    code: "DISCUSSION_001",
    msg: "Discussion Not Found",
};
