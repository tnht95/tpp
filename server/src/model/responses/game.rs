use chrono::{DateTime, Utc};
use serde::Serialize;
use uuid::Uuid;

use crate::model::responses::HttpResponseConstErr;

#[derive(Serialize, sqlx::FromRow)]
#[serde(rename_all = "camelCase")]
pub struct GameSummary {
    pub id: Uuid,
    pub name: String,
    pub author_id: i64,
    pub author_name: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub avatar_url: Option<String>,
    pub up_votes: i64,
    pub down_votes: i64,
}

#[derive(Serialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct GameDetails {
    pub id: Uuid,
    pub name: String,
    pub author_id: i64,
    pub author_name: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub url: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub avatar_url: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub about: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub info: Option<String>,
    pub up_votes: i64,
    pub down_votes: i64,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub tags: Option<Vec<String>>,
    pub rom: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub is_up_voted: Option<bool>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

pub const NOT_AUTH_DEL: HttpResponseConstErr = HttpResponseConstErr {
    code: "GAME_001",
    msg: "Not Authorized To Delete",
};

pub const NOT_FOUND: HttpResponseConstErr = HttpResponseConstErr {
    code: "GAME_002",
    msg: "Game Not Found",
};

pub const INVALID_ROM: HttpResponseConstErr = HttpResponseConstErr {
    code: "GAME_003",
    msg: "Invalid Rom",
};

pub const DESERIALIZE_GAME_ERR: HttpResponseConstErr = HttpResponseConstErr {
    code: "GAME_004",
    msg: "Failed To Deserialize Game From Bytes",
};
