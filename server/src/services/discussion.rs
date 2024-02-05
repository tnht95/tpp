use std::sync::Arc;

use async_trait::async_trait;
use sqlx::{Postgres, QueryBuilder};
use thiserror::Error;
use uuid::Uuid;

use crate::{
    database::{entities::discussion::Discussion, IDatabase},
    model::{
        requests::{discussion::AddDiscussionRequest, PaginationWithTargetInternal},
        responses::discussion::DiscussionResponse,
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
    ) -> Result<Vec<Discussion>, DiscussionServiceErr>;
    async fn add(
        &self,
        user_id: i64,
        user_name: String,
        discussion: AddDiscussionRequest,
    ) -> Result<Discussion, DiscussionServiceErr>;
    async fn get_by_id(&self, id: Uuid)
        -> Result<Option<DiscussionResponse>, DiscussionServiceErr>;
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
    ) -> Result<Vec<Discussion>, DiscussionServiceErr> {
        let mut query_builder: QueryBuilder<Postgres> = QueryBuilder::new("");

        let mut separated = query_builder.separated(" ");
        separated.push("select * from discussions where game_id =");
        separated.push_bind(pagination.target_id);
        separated.push("offset");
        separated.push_bind(pagination.offset);
        separated.push("limit");
        separated.push_bind(pagination.limit);

        query_builder
            .build_query_as::<Discussion>()
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

    async fn get_by_id(
        &self,
        id: Uuid,
    ) -> Result<Option<DiscussionResponse>, DiscussionServiceErr> {
        sqlx::query_as!(
            DiscussionResponse,
            "select discussions.*, users.avatar as user_avatar \
            from discussions join users on discussions.user_id = users.id \
            where discussions.id = $1;",
            id
        )
        .fetch_optional(self.db.get_pool())
        .await
        .map_err(|e| DiscussionServiceErr::Other(e.into()))
    }
}
