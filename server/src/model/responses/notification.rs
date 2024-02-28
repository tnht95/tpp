use chrono::{DateTime, Utc};
use serde::Serialize;
use uuid::Uuid;

use crate::database::entities::notification::NotificationType;

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Notification {
    pub id: i64,
    pub to_user_id: i64,
    pub by_user_id: i64,
    pub by_user_name: String,
    pub by_user_name_avatar: String,
    pub by_object_id: Uuid,
    pub target_type: NotificationType,
    pub target_id: Uuid,
    pub parent_target_id: Option<Uuid>,
    pub is_read: bool,
    pub created_at: DateTime<Utc>,
}
