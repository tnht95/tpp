use serde::Deserialize;

#[derive(Deserialize, sqlx::Type)]
#[serde(rename_all = "camelCase")]
#[sqlx(type_name = "like_type", rename_all = "camelCase")]
pub enum LikeType {
    Discussions,
    Comments,
    Posts,
}
