use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct User {
    pub id: i64,
    pub name: String,
    pub github_url: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub bio: Option<String>,
    pub avatar: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}
