use std::sync::Arc;

use async_trait::async_trait;
use sqlx::{Postgres, QueryBuilder};
use thiserror::Error;

use crate::{
    database::{
        entities::comment::{Comment, TargetTypes},
        IDatabase,
    },
    model::requests::comment::{AddCommentRequest, CommentQuery},
};

#[derive(Error, Debug)]
pub enum CommentServiceErr {
    #[error(transparent)]
    Other(#[from] anyhow::Error),
}

#[async_trait]
pub trait ICommentService {
    async fn filter(&self, query: CommentQuery) -> Result<Vec<Comment>, CommentServiceErr>;
    async fn add(
        &self,
        user_id: i64,
        user_name: String,
        comment: AddCommentRequest,
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

    async fn add(
        &self,
        user_id: i64,
        user_name: String,
        comment: AddCommentRequest,
    ) -> Result<Comment, CommentServiceErr> {
        match sqlx::query_as!(
        Comment,
        r#"INSERT INTO comments (user_id, user_name, target_id, target_type, content) VALUES ($1, $2, $3, $4, $5)
        returning id, user_id, user_name, target_id, content, likes, target_type as "target_type!: TargetTypes", created_at, updated_at"#,
        user_id,
        user_name,
        comment.target_id,
        comment.target_type as TargetTypes,
        comment.content
    )
            .fetch_one(self.db.get_pool())
            .await
        {
            Ok(comment) => Ok(comment),
            Err(e) => Err(CommentServiceErr::Other(e.into())),
        }
    }
}
