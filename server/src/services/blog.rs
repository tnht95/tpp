use std::sync::Arc;

use async_trait::async_trait;
use thiserror::Error;
use uuid::Uuid;

use crate::{
    database::{entities::blog::Blog, IDatabase},
    model::{
        requests::{
            blog::{AddBlogRequest, EditBlogRequest},
            PaginationInternal,
        },
        responses::blog::BlogSummary,
    },
    utils::clean_duplicate,
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
    async fn add(&self, blog: AddBlogRequest) -> Result<(), BlogServiceErr>;
    async fn get_by_id(&self, id: Uuid) -> Result<Option<Blog>, BlogServiceErr>;
    async fn delete(&self, id: Uuid) -> Result<(), BlogServiceErr>;
    async fn edit(&self, id: Uuid, comment: EditBlogRequest) -> Result<(), BlogServiceErr>;
    async fn get_tags(&self) -> Result<Vec<Option<String>>, BlogServiceErr>;
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
        sqlx::query_as!(
            BlogSummary,
            "select id, title, description, tags, created_at from blogs order by created_at desc offset $1 limit $2",
            pagination.offset,
            pagination.limit
        )
        .fetch_all(self.db.get_pool())
        .await
        .map_err(|e| BlogServiceErr::Other(e.into()))
    }

    async fn add(&self, blog: AddBlogRequest) -> Result<(), BlogServiceErr> {
        sqlx::query_as!(
            Blog,
            "insert into blogs (title, description, content, tags) values ($1, $2, $3, $4)",
            blog.title,
            blog.description,
            blog.content,
            &clean_duplicate(blog.tags)
        )
        .execute(self.db.get_pool())
        .await
        .map(|_| ())
        .map_err(|e| BlogServiceErr::Other(e.into()))
    }

    async fn get_by_id(&self, id: Uuid) -> Result<Option<Blog>, BlogServiceErr> {
        sqlx::query_as!(Blog, "select * from blogs where id = $1", id)
            .fetch_optional(self.db.get_pool())
            .await
            .map_err(|e| BlogServiceErr::Other(e.into()))
    }

    async fn delete(&self, id: Uuid) -> Result<(), BlogServiceErr> {
        sqlx::query!("delete from blogs where id = $1", id)
            .execute(self.db.get_pool())
            .await
            .map(|_| ())
            .map_err(|e| BlogServiceErr::Other(e.into()))
    }

    async fn edit(&self, id: Uuid, blog: EditBlogRequest) -> Result<(), BlogServiceErr> {
        sqlx::query_as!(
            Blog,
            "update blogs set content = $1, title = $2, description = $3, tags = $4, updated_at = now() where id = $5",
            blog.content,
            blog.title,
            blog.description,
            blog.tags.as_deref(),
            id,
        )
        .execute(self.db.get_pool())
        .await
        .map(|_| ())
        .map_err(|e| BlogServiceErr::Other(e.into()))
    }

    async fn get_tags(&self) -> Result<Vec<Option<String>>, BlogServiceErr> {
        sqlx::query_scalar!("SELECT DISTINCT unnest(tags) AS tag FROM blogs")
            .fetch_all(self.db.get_pool())
            .await
            .map_err(|e| BlogServiceErr::Other(e.into()))
    }
}
