use std::sync::Arc;

use async_trait::async_trait;
use thiserror::Error;
use uuid::Uuid;

use crate::{
    database::{entities::discussion::Discussion, IDatabase},
    model::{
        requests::{discussion::AddDiscussionRequest, PaginationWithTargetInternal},
        responses::discussion::{DiscussionDetail, DiscussionFiltered},
    },
};

#[derive(Error, Debug)]
pub enum DiscussionServiceErr {
    #[error(transparent)]
    Other(#[from] anyhow::Error),
}

#[async_trait]
pub trait IDiscussionService {
    async fn filter(
        &self,
        pagination: PaginationWithTargetInternal,
    ) -> Result<Vec<DiscussionFiltered>, DiscussionServiceErr>;
    async fn add(
        &self,
        user_id: i64,
        user_name: String,
        discussion: AddDiscussionRequest,
    ) -> Result<Discussion, DiscussionServiceErr>;
    async fn get_by_id(&self, id: Uuid) -> Result<Option<DiscussionDetail>, DiscussionServiceErr>;
}

pub struct DiscussionService<T: IDatabase> {
    db: Arc<T>,
}

impl<T> DiscussionService<T>
where
    T: IDatabase,
{
    pub fn new(db: Arc<T>) -> Self {
        Self { db }
    }
}

#[async_trait]
impl<T> IDiscussionService for DiscussionService<T>
where
    T: IDatabase + Send + Sync,
{
    async fn filter(
        &self,
        pagination: PaginationWithTargetInternal,
    ) -> Result<Vec<DiscussionFiltered>, DiscussionServiceErr> {
        sqlx::query_as!(
            DiscussionFiltered,
            "select id, title, created_at, user_name from discussions where game_id = $1 order by created_at desc offset $2 limit $3",
            pagination.target_id,
            pagination.offset,
            pagination.limit
        )
        .fetch_all(self.db.get_pool())
        .await
        .map_err(|e| DiscussionServiceErr::Other(e.into()))
    }

    async fn add(
        &self,
        user_id: i64,
        user_name: String,
        discussion: AddDiscussionRequest,
    ) -> Result<Discussion, DiscussionServiceErr> {
        sqlx::query_as!(
            Discussion,
            "insert into discussions (user_id, user_name, game_id, title, content) values ($1, $2, $3, $4, $5) returning *",
            user_id,
            user_name,
            discussion.game_id,
            discussion.title,
            discussion.content
        )
        .fetch_one(self.db.get_pool())
        .await
        .map_err(|e| DiscussionServiceErr::Other(e.into()))
    }

    async fn get_by_id(&self, id: Uuid) -> Result<Option<DiscussionDetail>, DiscussionServiceErr> {
        sqlx::query_as!(
            DiscussionDetail,
            "select discussions.*, users.avatar as user_avatar
            from discussions join users on discussions.user_id = users.id
            where discussions.id = $1",
            id
        )
        .fetch_optional(self.db.get_pool())
        .await
        .map_err(|e| DiscussionServiceErr::Other(e.into()))
    }
}
