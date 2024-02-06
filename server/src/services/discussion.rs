use std::sync::Arc;

use async_trait::async_trait;
use thiserror::Error;
use uuid::Uuid;

use crate::{
    database::IDatabase,
    model::{
        requests::{
            discussion::{AddDiscussionRequest, EditDiscussionRequest},
            Pagination,
        },
        responses::discussion::{DiscussionDetails, DiscussionSummary},
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
        game_id: Uuid,
        pagination: Pagination,
    ) -> Result<Vec<DiscussionSummary>, DiscussionServiceErr>;
    async fn add(
        &self,
        user_id: i64,
        user_name: String,
        game_id: Uuid,
        discussion: AddDiscussionRequest,
    ) -> Result<(), DiscussionServiceErr>;
    async fn get_by_id(&self, id: Uuid) -> Result<Option<DiscussionDetails>, DiscussionServiceErr>;
    async fn edit(
        &self,
        id: Uuid,
        discussion: EditDiscussionRequest,
    ) -> Result<(), DiscussionServiceErr>;
    async fn delete(&self, id: Uuid) -> Result<(), DiscussionServiceErr>;
    async fn existed(&self, id: Uuid, author_id: i64) -> Result<bool, DiscussionServiceErr>;
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
        game_id: Uuid,
        pagination: Pagination,
    ) -> Result<Vec<DiscussionSummary>, DiscussionServiceErr> {
        sqlx::query_as!(
            DiscussionSummary,
            "select id, title, created_at, user_name from discussions where game_id = $1 order by created_at desc offset $2 limit $3",
            game_id,
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
        game_id: Uuid,
        discussion: AddDiscussionRequest,
    ) -> Result<(), DiscussionServiceErr> {
        sqlx::query!(
            "insert into discussions (user_id, user_name, game_id, title, content) values ($1, $2, $3, $4, $5)",
            user_id,
            user_name,
            game_id,
            discussion.title,
            discussion.content
        )
        .execute(self.db.get_pool())
        .await
        .map(|_| ())
        .map_err(|e| DiscussionServiceErr::Other(e.into()))
    }

    async fn get_by_id(&self, id: Uuid) -> Result<Option<DiscussionDetails>, DiscussionServiceErr> {
        sqlx::query_as!(
            DiscussionDetails,
            "select 
                discussions.id, 
                discussions.user_id, 
                discussions.user_name, 
                users.avatar as user_avatar,
                discussions.game_id, 
                discussions.title, 
                discussions.content, 
                discussions.created_at
            from discussions 
            join users on discussions.user_id = users.id
            where discussions.id = $1",
            id
        )
        .fetch_optional(self.db.get_pool())
        .await
        .map_err(|e| DiscussionServiceErr::Other(e.into()))
    }

    async fn edit(
        &self,
        id: Uuid,
        discussion: EditDiscussionRequest,
    ) -> Result<(), DiscussionServiceErr> {
        sqlx::query!(
            "update discussions set content = $1, title = $2, updated_at = now() where id = $3",
            discussion.content,
            discussion.title,
            id,
        )
        .execute(self.db.get_pool())
        .await
        .map(|_| ())
        .map_err(|e| DiscussionServiceErr::Other(e.into()))
    }

    async fn delete(&self, id: Uuid) -> Result<(), DiscussionServiceErr> {
        sqlx::query!("delete from discussions where id = $1", id)
            .execute(self.db.get_pool())
            .await
            .map(|_| ())
            .map_err(|e| DiscussionServiceErr::Other(e.into()))
    }

    async fn existed(&self, id: Uuid, author_id: i64) -> Result<bool, DiscussionServiceErr> {
        sqlx::query!(
            "select count(*) as discussion_count from discussions where id = $1 and user_id = $2",
            id,
            author_id
        )
        .fetch_one(self.db.get_pool())
        .await
        .map(|result| result.discussion_count.map(|c| c > 0).unwrap_or(false))
        .map_err(|e| DiscussionServiceErr::Other(e.into()))
    }
}
