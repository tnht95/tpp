use chrono::{DateTime, Utc};
use serde::Serialize;
use uuid::Uuid;

use crate::model::responses::HttpResponseConstErr;

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct BlogSummary {
    pub id: Uuid,
    pub title: String,
    pub description: String,
    pub tags: Option<Vec<String>>,
    pub created_at: DateTime<Utc>,
}

pub const NOT_FOUND: HttpResponseConstErr = HttpResponseConstErr {
    code: "BLOG_001",
    msg: "Blog Not Found",
};
