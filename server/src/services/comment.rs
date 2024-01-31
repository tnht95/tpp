use std::sync::Arc;

use async_trait::async_trait;
use sqlx::{Postgres, QueryBuilder};
use thiserror::Error;

use crate::{
    database::{entities::comment::Comment, IDatabase},
    model::requests::comment::CommentQuery,
};

#[derive(Error, Debug)]
pub enum CommentServiceErr {
    #[error(transparent)]
    Other(#[from] anyhow::Error),
}

#[async_trait]
pub trait ICommentService {
    async fn filter(&self, query: CommentQuery) -> Result<Vec<Comment>, CommentServiceErr>;
    // async fn add(&self, comment: AddCommentRequest) -> Result<Comment, CommentServiceErr>;
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
    async fn filter(&self, query: CommentQuery) -> Result<Vec<Comment>, CommentServiceErr> {
        let mut query_builder: QueryBuilder<Postgres> = QueryBuilder::new("");

        let mut separated = query_builder.separated(" ");
        separated.push("select * from comments where target_id =");
        separated.push_bind(query.target_id);

        if let Some(offset) = query.offset {
            separated.push("offset");
            separated.push(offset);
        }

        if let Some(limit) = query.limit {
            separated.push("limit");
            separated.push_bind(limit);
        }

        match query_builder
            .build_query_as::<Comment>()
            .fetch_all(self.db.get_pool())
            .await
        {
            Ok(blogs) => Ok(blogs),
            Err(e) => Err(CommentServiceErr::Other(e.into())),
        }
    }
}
