use std::sync::Arc;

use async_trait::async_trait;
use thiserror::Error;
use uuid::Uuid;

use crate::{
    database::{
        entities::comment::{Comment, TargetTypes},
        IDatabase,
    },
    model::requests::{
        comment::{AddCommentRequest, EditCommentRequest},
        PaginationWithTargetInternal,
    },
};

#[derive(Error, Debug)]
pub enum CommentServiceErr {
    #[error(transparent)]
    Other(#[from] anyhow::Error),
}

#[async_trait]
pub trait ICommentService {
    async fn filter(
        &self,
        pagination: PaginationWithTargetInternal,
    ) -> Result<Vec<Comment>, CommentServiceErr>;
    async fn add(
        &self,
        user_id: i64,
        user_name: String,
        comment: AddCommentRequest,
    ) -> Result<Comment, CommentServiceErr>;
    async fn delete(&self, id: Uuid) -> Result<(), CommentServiceErr>;
    async fn existed(&self, id: Uuid, author_id: i64) -> Result<bool, CommentServiceErr>;
    async fn edit(
        &self,
        id: Uuid,
        comment: EditCommentRequest,
    ) -> Result<Comment, CommentServiceErr>;
}

pub struct CommentService<T: IDatabase> {
    db: Arc<T>,
}

impl<T> CommentService<T>
where
    T: IDatabase,
{
    pub fn new(db: Arc<T>) -> Self {
        Self { db }
    }
}

#[async_trait]
impl<T> ICommentService for CommentService<T>
where
    T: IDatabase + Send + Sync,
{
    async fn filter(
        &self,
        pagination: PaginationWithTargetInternal,
    ) -> Result<Vec<Comment>, CommentServiceErr> {
        sqlx::query_as!(
            Comment,
            r#"select id, user_id, user_name, target_id, content, likes, target_type as "target_type!: TargetTypes", created_at, updated_at
            from comments where target_id = $1 offset $2 limit $3"#,
            pagination.target_id,
            pagination.offset,
            pagination.limit
        )
            .fetch_all(self.db.get_pool())
            .await
            .map_err(|e| CommentServiceErr::Other(e.into()))
    }

    async fn add(
        &self,
        user_id: i64,
        user_name: String,
        comment: AddCommentRequest,
    ) -> Result<Comment, CommentServiceErr> {
        sqlx::query_as!(
            Comment,
            r#"insert into comments (user_id, user_name, target_id, target_type, content) values ($1, $2, $3, $4, $5)
            returning id, user_id, user_name, target_id, content, likes, target_type as "target_type!: TargetTypes", created_at, updated_at"#,
            user_id,
            user_name,
            comment.target_id,
            comment.target_type as TargetTypes,
            comment.content
        )
        .fetch_one(self.db.get_pool())
        .await
        .map_err(|e|CommentServiceErr::Other(e.into()))
    }

    async fn delete(&self, id: Uuid) -> Result<(), CommentServiceErr> {
        sqlx::query!("delete from comments where id = $1", id)
            .execute(self.db.get_pool())
            .await
            .map(|_| ())
            .map_err(|e| CommentServiceErr::Other(e.into()))
    }

    async fn existed(&self, id: Uuid, author_id: i64) -> Result<bool, CommentServiceErr> {
        sqlx::query!(
            "select count(*) as comment_count from comments where id = $1 and user_id = $2",
            id,
            author_id
        )
        .fetch_one(self.db.get_pool())
        .await
        .map(|result| result.comment_count.map(|c| c > 0).unwrap_or(false))
        .map_err(|e| CommentServiceErr::Other(e.into()))
    }

    async fn edit(
        &self,
        id: Uuid,
        comment: EditCommentRequest,
    ) -> Result<Comment, CommentServiceErr> {
        sqlx::query_as!(
            Comment,
            r#"update comments set content = $1, updated_at = now() where id = $2
            returning id, user_id, user_name, target_id, content, likes, target_type as "target_type!: TargetTypes", created_at, updated_at"#,
            comment.content,
            id,
        )
        .fetch_one(self.db.get_pool())
        .await
        .map_err(|e|CommentServiceErr::Other(e.into()))
    }
}
