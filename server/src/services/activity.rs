use std::sync::Arc;

use async_trait::async_trait;
use thiserror::Error;

use crate::{
    database::{
        entities::activity::{Activity, ActivityType},
        IDatabase,
    },
    model::requests::PaginationWithTargetInternal,
};

#[derive(Error, Debug)]
pub enum ActivityServiceErr {
    #[error(transparent)]
    Other(#[from] anyhow::Error),
}

#[async_trait]
pub trait IActivityService {
    async fn filter(
        &self,
        user_id: i64,
        pagination: PaginationWithTargetInternal,
    ) -> Result<Vec<Activity>, ActivityServiceErr>;
}

pub struct ActivityService<T: IDatabase> {
    db: Arc<T>,
}

impl<T> ActivityService<T>
where
    T: IDatabase,
{
    pub fn new(db: Arc<T>) -> Self {
        Self { db }
    }
}

#[async_trait]
impl<T> IActivityService for ActivityService<T>
where
    T: IDatabase + Send + Sync,
{
    async fn filter(
        &self,
        user_id: i64,
        pagination: PaginationWithTargetInternal,
    ) -> Result<Vec<Activity>, ActivityServiceErr> {
        sqlx::query_as!(
            Activity,
            r#"
            select
                user_id,
                target_type as "target_type!: ActivityType",
                target_id,
                memo,
                created_at
            from activities
            where 
                user_id = $1
                AND ($2 = uuid_nil() OR target_id = $2)
            order by created_at desc offset $3 limit $4
            "#,
            user_id,
            pagination.target_id,
            pagination.offset,
            pagination.limit
        )
        .fetch_all(self.db.get_pool())
        .await
        .map_err(|e| ActivityServiceErr::Other(e.into()))
    }
}
