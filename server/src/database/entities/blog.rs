use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Serialize, Deserialize, sqlx::FromRow)]
#[serde(rename_all = "camelCase")]
pub struct BlogDetails {
    pub id: Uuid,
    pub title: String,
    pub description: String,
    pub content: String,
    pub tags: Option<Vec<String>>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Serialize, Deserialize, sqlx::FromRow)]
#[serde(rename_all = "camelCase")]
pub struct Blog {
    pub id: Uuid,
    pub title: String,
    pub description: String,
    pub tags: Option<Vec<String>>,
    pub created_at: DateTime<Utc>,
}