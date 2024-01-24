use std::sync::Arc;

use async_trait::async_trait;
use thiserror::Error;

use crate::database::{entities::blog::Blog, IDatabase};

#[derive(Error, Debug)]
pub enum BlogServiceErr {
    #[error(transparent)]
    Other(#[from] anyhow::Error),
}

#[async_trait]
pub trait IBlogService {
    async fn get_all(&self) -> Result<Vec<Blog>, BlogServiceErr>;
    // async fn add(&self, post: AddBlogRequest) -> Result<Blog, BlogServiceErr>;
}

pub struct BlogService<T: IDatabase> {
    db: Arc<T>,
}

impl<T> BlogService<T>
where
    T: IDatabase,
{
    pub fn new(db: Arc<T>) -> Self {
        Self { db }
    }
}

#[async_trait]
impl<T> IBlogService for BlogService<T>
where
    T: IDatabase + Send + Sync,
{
    async fn get_all(&self) -> Result<Vec<Blog>, BlogServiceErr> {
        match sqlx::query_as!(
            Blog,
            "select id, title, description, tags, created_at from blogs order by created_at desc"
        )
        .fetch_all(self.db.get_pool())
        .await
        {
            Ok(blogs) => Ok(blogs),
            Err(e) => Err(BlogServiceErr::Other(e.into())),
        }
    }
}
