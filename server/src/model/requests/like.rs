use serde::Deserialize;
use uuid::Uuid;
use validator::Validate;

use crate::database::entities::like::LikeType;

#[derive(Deserialize, Validate)]
#[serde(rename_all = "camelCase")]
pub struct AddLikeRequest {
    pub target_id: Uuid,
    pub target_type: LikeType,
}

pub type DeleteLikeRequest = AddLikeRequest;
