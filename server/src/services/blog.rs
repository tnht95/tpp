use std::sync::Arc;

use async_trait::async_trait;
use thiserror::Error;

use crate::{
    database::{
        entities::blog::{Blog, BlogSummary},
        IDatabase,
    },
    model::requests::blog::AddBlogRequest,
};

#[derive(Error, Debug)]
pub enum BlogServiceErr {
    #[error(transparent)]
    Other(#[from] anyhow::Error),
}

#[async_trait]
pub trait IBlogService {
    async fn get_all(&self) -> Result<Vec<BlogSummary>, BlogServiceErr>;
    async fn add(&self, blog: AddBlogRequest) -> Result<Blog, BlogServiceErr>;
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
    async fn get_all(&self) -> Result<Vec<BlogSummary>, BlogServiceErr> {
        match sqlx::query_as!(
            BlogSummary,
            "select id, title, description, tags, created_at from blogs order by created_at desc"
        )
        .fetch_all(self.db.get_pool())
        .await
        {
            Ok(blogs) => Ok(blogs),
            Err(e) => Err(BlogServiceErr::Other(e.into())),
        }
    }

    async fn add(&self, blog: AddBlogRequest) -> Result<Blog, BlogServiceErr> {
        match sqlx::query_as!(
            Blog,
            "insert into blogs (title, description, content, tags) values ($1, $2, $3, $4) returning *",
            blog.title,
            blog.description,
            blog.content,
            blog.tags.as_deref()
        )
            .fetch_one(self.db.get_pool())
            .await
        {
            Ok(blog) => Ok(blog),
            Err(e) => Err(BlogServiceErr::Other(e.into())),
        }
    }
}
