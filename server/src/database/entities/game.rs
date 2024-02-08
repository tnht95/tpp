use chrono::{DateTime, Utc};
use serde::Serialize;
use uuid::Uuid;

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Game {
    pub id: Uuid,
    pub name: String,
    pub author_id: i64,
    pub author_name: String,
    pub url: Option<String>,
    pub avatar_url: Option<String>,
    pub about: Option<String>,
    pub info: Option<String>,
    pub up_votes: i16,
    pub down_votes: i16,
    pub tags: Option<Vec<String>>,
    pub rom: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}
