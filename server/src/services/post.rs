use std::sync::Arc;

use async_trait::async_trait;
use sqlx::{Postgres, QueryBuilder};
use thiserror::Error;
use uuid::Uuid;

use crate::{
    database::{entities::post::Post, IDatabase},
    model::requests::{post::AddPostRequest, PaginationInternal},
};

#[derive(Error, Debug)]
pub enum PostServiceErr {
    #[error(transparent)]
    Other(#[from] anyhow::Error),
}

#[async_trait]
pub trait IPostService {
    async fn filter(&self, pagination: PaginationInternal) -> Result<Vec<Post>, PostServiceErr>;
    async fn add(&self, author_id: i64, post: AddPostRequest) -> Result<Post, PostServiceErr>;
    async fn delete(&self, id: Uuid) -> Result<(), PostServiceErr>;
    async fn existed(&self, id: Uuid, author_id: i64) -> Result<bool, PostServiceErr>;
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
    async fn filter(&self, pagination: PaginationInternal) -> Result<Vec<Post>, PostServiceErr> {
        let mut query_builder: QueryBuilder<Postgres> = QueryBuilder::new("");

        let mut separated = query_builder.separated(" ");
        separated.push("select * from posts");
        separated.push(format!("order by created_at {}", pagination.order_by));
        separated.push("offset");
        separated.push_bind(pagination.offset);
        separated.push("limit");
        separated.push_bind(pagination.limit);

        match query_builder
            .build_query_as::<Post>()
            .fetch_all(self.db.get_pool())
            .await
        {
            Ok(posts) => Ok(posts),
            Err(e) => Err(PostServiceErr::Other(e.into())),
        }
    }

    async fn add(&self, author_id: i64, post: AddPostRequest) -> Result<Post, PostServiceErr> {
        match sqlx::query_as!(
            Post,
            "insert into posts (author_id, content) values ($1, $2) returning *",
            author_id,
            post.content
        )
        .fetch_one(self.db.get_pool())
        .await
        {
            Ok(posts) => Ok(posts),
            Err(e) => Err(PostServiceErr::Other(e.into())),
        }
    }

    async fn delete(&self, id: Uuid) -> Result<(), PostServiceErr> {
        match sqlx::query!("delete from posts where id = $1", id)
            .execute(self.db.get_pool())
            .await
        {
            Ok(_) => Ok(()),
            Err(e) => Err(PostServiceErr::Other(e.into())),
        }
    }

    async fn existed(&self, id: Uuid, author_id: i64) -> Result<bool, PostServiceErr> {
        match sqlx::query!(
            "select count(*) as post_count from posts where id = $1 and author_id = $2",
            id,
            author_id
        )
        .fetch_one(self.db.get_pool())
        .await
        {
            Ok(result) => match result.post_count {
                None => Ok(false),
                Some(count) => Ok(count > 0),
            },
            Err(e) => Err(PostServiceErr::Other(e.into())),
        }
    }
}
