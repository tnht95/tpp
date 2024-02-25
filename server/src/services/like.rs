use std::sync::Arc;

use async_trait::async_trait;
use thiserror::Error;

use crate::{
    database::{entities::like::LikeType, IDatabase},
    model::requests::like::{AddLikeRequest, DeleteLikeRequest},
};

#[derive(Error, Debug)]
pub enum LikeServiceErr {
    #[error(transparent)]
    Other(#[from] anyhow::Error),
}

#[async_trait]
pub trait ILikeService {
    async fn like(&self, user_id: i64, like: AddLikeRequest) -> Result<(), LikeServiceErr>;
    async fn unlike(&self, user_id: i64, like: DeleteLikeRequest) -> Result<(), LikeServiceErr>;
}

pub struct LikeService<T: IDatabase> {
    db: Arc<T>,
}

impl<T> LikeService<T>
where
    T: IDatabase,
{
    pub fn new(db: Arc<T>) -> Self {
        Self { db }
    }
}

#[async_trait]
impl<T> ILikeService for LikeService<T>
where
    T: IDatabase + Send + Sync,
{
    async fn like(&self, user_id: i64, like: AddLikeRequest) -> Result<(), LikeServiceErr> {
        sqlx::query!(
            "select insert_like($1, $2, $3)",
            user_id,
            like.target_id,
            like.target_type as LikeType
        )
        .execute(self.db.get_pool())
        .await
        .map(|_| ())
        .map_err(|e| LikeServiceErr::Other(e.into()))
    }

    async fn unlike(&self, user_id: i64, like: DeleteLikeRequest) -> Result<(), LikeServiceErr> {
        sqlx::query!(
            "select delete_like($1, $2, $3)",
            user_id,
            like.target_id,
            like.target_type as LikeType
        )
        .execute(self.db.get_pool())
        .await
        .map(|_| ())
        .map_err(|e| LikeServiceErr::Other(e.into()))
    }
}
