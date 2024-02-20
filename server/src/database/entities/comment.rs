// use chrono::{DateTime, Utc};
// use uuid::Uuid;
//
// pub struct Comment {
//     pub id: Uuid,
//     pub user_id: i64,
//     pub user_name: String,
//     pub target_id: Uuid,
//     pub content: String,
//     pub likes: i64,
//     pub target_type: CommentType,
//     pub created_at: DateTime<Utc>,
//     pub updated_at: DateTime<Utc>,
// }

use serde::Deserialize;
#[derive(Deserialize, sqlx::Type)]
#[serde(rename_all = "camelCase")]
#[sqlx(type_name = "comment_type", rename_all = "camelCase")]
pub enum CommentType {
    Blog,
    Discussion,
    Post,
}
