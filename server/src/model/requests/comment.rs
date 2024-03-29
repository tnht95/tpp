use serde::Deserialize;
use uuid::Uuid;
use validator::Validate;

use crate::database::entities::comment::CommentType;

#[derive(Deserialize, Validate)]
#[serde(rename_all = "camelCase")]
pub struct AddCommentRequest {
    pub target_id: Uuid,
    pub target_type: CommentType,
    #[validate(length(min = 1, message = "Can not be empty"))]
    #[validate(length(max = 200, message = "Too long, exceeding 200 characters."))]
    pub content: String,
}

pub type EditCommentRequest = AddCommentRequest;

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DeleteCommentRequest {
    pub target_id: Uuid,
    pub target_type: CommentType,
}
