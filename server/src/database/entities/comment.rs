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
//     pub target_type: TargetTypes,
//     pub created_at: DateTime<Utc>,
//     pub updated_at: DateTime<Utc>,
// }

use serde::Deserialize;
#[derive(Deserialize, sqlx::Type)]
#[sqlx(type_name = "target_types")]
pub enum TargetTypes {
    Blog,
    Discussion,
    Post,
}
