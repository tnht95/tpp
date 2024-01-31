use serde::Deserialize;
use uuid::Uuid;

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CommentQuery {
    pub target_id: Uuid,
    pub offset: Option<i16>,
    pub limit: Option<i16>,
}
