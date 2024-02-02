use std::sync::Arc;

use async_trait::async_trait;
use sqlx::{Postgres, QueryBuilder};
use thiserror::Error;

use crate::{
    database::{entities::discussion::Discussion, IDatabase},
    model::requests::QueryWithTarget,
};

#[derive(Error, Debug)]
pub enum DiscussionServiceErr {
    #[error(transparent)]
    Other(#[from] anyhow::Error),
}

#[async_trait]
pub trait IDiscussionService {
    async fn filter(&self, query: QueryWithTarget)
        -> Result<Vec<Discussion>, DiscussionServiceErr>;
}

pub struct DiscussionService<T: IDatabase> {
    db: Arc<T>,
}

impl<T> DiscussionService<T>
where
    T: IDatabase,
{
    pub fn new(db: Arc<T>) -> Self {
        Self { db }
    }
}

#[async_trait]
impl<T> IDiscussionService for DiscussionService<T>
where
    T: IDatabase + Send + Sync,
{
    async fn filter(
        &self,
        query: QueryWithTarget,
    ) -> Result<Vec<Discussion>, DiscussionServiceErr> {
        let mut query_builder: QueryBuilder<Postgres> = QueryBuilder::new("");

        let mut separated = query_builder.separated(" ");
        separated.push("select * from discussions where game_id =");
        separated.push_bind(query.target_id);
        separated.push("offset");
        separated.push_bind(query.offset);
        separated.push("limit");
        separated.push_bind(query.limit);

        match query_builder
            .build_query_as::<Discussion>()
            .fetch_all(self.db.get_pool())
            .await
        {
            Ok(discussions) => Ok(discussions),
            Err(e) => Err(DiscussionServiceErr::Other(e.into())),
        }
    }
}
