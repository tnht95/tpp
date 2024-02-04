use std::sync::Arc;

use async_trait::async_trait;
use sqlx::{Postgres, QueryBuilder};
use thiserror::Error;
use uuid::Uuid;

use crate::{
    database::{
        entities::blog::{Blog, BlogSummary},
        IDatabase,
    },
    model::requests::{blog::AddBlogRequest, PaginationInternal},
};
#[derive(Error, Debug)]
pub enum BlogServiceErr {
    #[error(transparent)]
    Other(#[from] anyhow::Error),
}

#[async_trait]
pub trait IBlogService {
    async fn filter(
        &self,
        pagination: PaginationInternal,
    ) -> Result<Vec<BlogSummary>, BlogServiceErr>;
    async fn add(&self, blog: AddBlogRequest) -> Result<Blog, BlogServiceErr>;
    async fn get_by_id(&self, id: Uuid) -> Result<Option<Blog>, BlogServiceErr>;
    async fn delete(&self, id: Uuid) -> Result<(), BlogServiceErr>;
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
    async fn filter(
        &self,
        pagination: PaginationInternal,
    ) -> Result<Vec<BlogSummary>, BlogServiceErr> {
        let mut query_builder: QueryBuilder<Postgres> = QueryBuilder::new("");
        let mut separated = query_builder.separated(" ");
        separated.push("select * from blogs");
        separated.push(format!("order by created_at {}", pagination.order_by));
        separated.push("offset");
        separated.push_bind(pagination.offset);
        separated.push("limit");
        separated.push_bind(pagination.limit);

        match query_builder
            .build_query_as::<BlogSummary>()
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

    async fn get_by_id(&self, id: Uuid) -> Result<Option<Blog>, BlogServiceErr> {
        match sqlx::query_as!(Blog, "select * from blogs where id = $1", id)
            .fetch_optional(self.db.get_pool())
            .await
        {
            Ok(game) => Ok(game),
            Err(e) => Err(BlogServiceErr::Other(e.into())),
        }
    }

    async fn delete(&self, id: Uuid) -> Result<(), BlogServiceErr> {
        match sqlx::query!("delete from blogs where id = $1", id)
            .execute(self.db.get_pool())
            .await
        {
            Ok(_) => Ok(()),
            Err(e) => Err(BlogServiceErr::Other(e.into())),
        }
    }
}
