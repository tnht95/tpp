use serde::Deserialize;
use uuid::Uuid;

use crate::database::entities::like::LikeType;

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AddLikeRequest {
    pub target_id: Uuid,
    pub target_type: LikeType,
}

pub type DeleteLikeRequest = AddLikeRequest;
