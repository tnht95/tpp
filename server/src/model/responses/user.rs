use chrono::{DateTime, Utc};
use serde::Serialize;

use crate::model::responses::HttpResponseConstErr;

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct UserSummary {
    pub id: i64,
    pub name: String,
    pub avatar: String,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct UserDetails {
    pub id: i64,
    pub name: String,
    pub github_url: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub bio: Option<String>,
    pub avatar: String,
    pub subscribers: i64,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub is_subscribed: Option<bool>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

pub const NOT_FOUND: HttpResponseConstErr = HttpResponseConstErr {
    code: "USER_001",
    msg: "User Not Found",
};
