use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use super::HttpResponseConstErr;
use crate::database::entities::notification::NotificationType;

#[derive(Serialize, Deserialize)]
#[serde(rename_all(serialize = "camelCase"))]
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

pub const INVALID_NOTI_ID: HttpResponseConstErr = HttpResponseConstErr {
    code: "NOTI_001",
    msg: "Invalid notification id",
};
