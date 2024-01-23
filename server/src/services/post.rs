use std::sync::Arc;

use async_trait::async_trait;
use thiserror::Error;

use crate::database::{entities::post::Post, IDatabase};

#[derive(Error, Debug)]
pub enum PostServiceErr {
    #[error(transparent)]
    Other(#[from] anyhow::Error),
}

#[async_trait]
pub trait IPostService {
    async fn get_all(&self) -> Result<Post, PostServiceErr>;
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
    async fn get_all(&self) -> Result<Post, PostServiceErr> {
        match sqlx::query_as!(Post, "select * from posts")
            .fetch_one(self.db.get_pool())
            .await
        {
            Ok(posts) => Ok(posts),
            Err(e) => Err(PostServiceErr::Other(e.into())),
        }
    }
}