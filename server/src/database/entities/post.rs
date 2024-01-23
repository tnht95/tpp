use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Serialize, Deserialize, sqlx::FromRow)]
pub struct Post {
    pub id: Uuid,
    pub author_id: i64,
    pub content: String,
    pub likes: i16,
    pub comments: i16,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}
