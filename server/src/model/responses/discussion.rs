use chrono::{DateTime, Utc};
use serde::Serialize;
use uuid::Uuid;

use crate::model::responses::HttpResponseConstErr;

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct DiscussionDetail {
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

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct DiscussionFiltered {
    pub id: Uuid,
    pub user_name: String,
    pub title: String,
    pub created_at: DateTime<Utc>,
}

pub const NOT_FOUND: HttpResponseConstErr = HttpResponseConstErr {
    code: "DISCUSSION_001",
    msg: "Discussion Not Found",
};
