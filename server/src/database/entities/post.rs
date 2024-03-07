use chrono::{DateTime, Utc};
use uuid::Uuid;

#[derive(sqlx::FromRow)]
pub struct Post {
    pub id: Uuid,
    pub user_id: i64,
    pub content: String,
    pub likes: i64,
    pub comments: i64,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}
