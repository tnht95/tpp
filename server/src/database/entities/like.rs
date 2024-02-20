use serde::Deserialize;

#[derive(Deserialize, sqlx::Type)]
#[serde(rename_all = "camelCase")]
#[sqlx(type_name = "like_target_types", rename_all = "camelCase")]
pub enum LikeTargetType {
    Discussions,
    Comments,
    Posts,
}
