use chrono::{DateTime, Utc};
use serde::Serialize;
use uuid::Uuid;

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Activity {
    pub user_id: i64,
    pub target_type: ActivityType,
    pub target_id: Uuid,
    pub memo: String,
    pub created_at: DateTime<Utc>,
}

#[derive(Serialize, sqlx::Type, Debug, PartialEq)]
#[serde(rename_all = "camelCase")]
#[sqlx(type_name = "activity_type", rename_all = "snake_case")]
pub enum ActivityType {
    User,
    AddedGame,
    UpdatedGame,
    Post,
}
