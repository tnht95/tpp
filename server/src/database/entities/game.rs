use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Serialize, Deserialize, sqlx::FromRow)]
pub struct Game {
    pub id: Uuid,
    pub name: String,
    pub author_id: i64,
    pub author_name: String,
    pub url: Option<String>,
    pub avatar_url: String,
    pub about: Option<String>,
    pub info: Option<String>,
    pub stars: i16,
    pub tags: Option<Vec<String>>,
    pub rom: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}
