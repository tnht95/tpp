use std::sync::Arc;

use async_trait::async_trait;
use thiserror::Error;
use uuid::Uuid;

use crate::{
    database::IDatabase,
    model::{
        requests::{
            post::{AddPostRequest, EditPostRequest},
            PaginationInternal,
        },
        responses::post::{PostContent, PostDetails},
    },
};

#[derive(Error, Debug)]
pub enum PostServiceErr {
    #[error(transparent)]
    Other(#[from] anyhow::Error),
}

#[async_trait]
pub trait IPostService {
    async fn filter(
        &self,
        pagination: PaginationInternal,
    ) -> Result<Vec<PostDetails>, PostServiceErr>;
    async fn get_by_id(&self, id: Uuid) -> Result<Option<PostDetails>, PostServiceErr>;
    async fn add(&self, author_id: i64, post: AddPostRequest) -> Result<(), PostServiceErr>;
    async fn delete(&self, id: Uuid) -> Result<(), PostServiceErr>;
    async fn existed(&self, id: Uuid, author_id: i64) -> Result<bool, PostServiceErr>;
    async fn edit(&self, id: Uuid, post: EditPostRequest) -> Result<PostContent, PostServiceErr>;
}

pub struct PostService<T: IDatabase> {
    db: Arc<T>,
}

impl<T> PostService<T>
where
    T: IDatabase,
{
    pub fn new(db: Arc<T>) -> Self {
        Self { db }
    }
}

#[async_trait]
impl<T> IPostService for PostService<T>
where
    T: IDatabase + Send + Sync,
{
    async fn filter(
        &self,
        pagination: PaginationInternal,
    ) -> Result<Vec<PostDetails>, PostServiceErr> {
        sqlx::query_as!(
            PostDetails,
            "select
                posts.id,
                posts.author_id,
                users.name as author_name,
                users.avatar as author_avatar,
                posts.content,
                posts.likes,
                posts.comments,
                posts.created_at
            from posts
            left join users on users.id = posts.author_id
            order by posts.created_at desc offset $1 limit $2",
            pagination.offset,
            pagination.limit
        )
        .fetch_all(self.db.get_pool())
        .await
        .map_err(|e| PostServiceErr::Other(e.into()))
    }

    async fn get_by_id(&self, id: Uuid) -> Result<Option<PostDetails>, PostServiceErr> {
        sqlx::query_as!(
            PostDetails,
            "select
                posts.id,
                posts.author_id,
                users.name as author_name,
                users.avatar as author_avatar,
                posts.content,
                posts.likes,
                posts.comments,
                posts.created_at
            from posts
            left join users on users.id = posts.author_id
            where posts.id = $1",
            id
        )
        .fetch_optional(self.db.get_pool())
        .await
        .map_err(|e| PostServiceErr::Other(e.into()))
    }

    async fn add(&self, author_id: i64, post: AddPostRequest) -> Result<(), PostServiceErr> {
        sqlx::query!(
            "insert into posts (author_id, content) values ($1, $2)",
            author_id,
            post.content
        )
        .execute(self.db.get_pool())
        .await
        .map(|_| ())
        .map_err(|e| PostServiceErr::Other(e.into()))
    }

    async fn delete(&self, id: Uuid) -> Result<(), PostServiceErr> {
        sqlx::query!("delete from posts where id = $1", id)
            .execute(self.db.get_pool())
            .await
            .map(|_| ())
            .map_err(|e| PostServiceErr::Other(e.into()))
    }

    async fn existed(&self, id: Uuid, author_id: i64) -> Result<bool, PostServiceErr> {
        sqlx::query!(
            "select count(*) as post_count from posts where id = $1 and author_id = $2",
            id,
            author_id
        )
        .fetch_one(self.db.get_pool())
        .await
        .map(|result| result.post_count.map(|c| c > 0).unwrap_or(false))
        .map_err(|e| PostServiceErr::Other(e.into()))
    }

    async fn edit(&self, id: Uuid, post: EditPostRequest) -> Result<PostContent, PostServiceErr> {
        sqlx::query_as!(
            PostContent,
            "update posts set content = $1, updated_at = now() where id = $2 returning id, content",
            post.content,
            id,
        )
        .fetch_one(self.db.get_pool())
        .await
        .map_err(|e| PostServiceErr::Other(e.into()))
    }
}
