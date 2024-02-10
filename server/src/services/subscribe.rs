use std::sync::Arc;

use async_trait::async_trait;
use sqlx::Error;
use thiserror::Error;

use crate::database::IDatabase;

#[derive(Error, Debug)]
pub enum SubscribeServiceErr {
    #[error(transparent)]
    Other(#[from] anyhow::Error),
    #[error("InvalidUser")]
    InvalidUser,
}

#[async_trait]
pub trait ISubscribeService {
    async fn subscribe_user(
        &self,
        subscriber_id: i64,
        user_id: i64,
    ) -> Result<(), SubscribeServiceErr>;
    async fn unsubscribe_user(
        &self,
        subscriber_id: i64,
        user_id: i64,
    ) -> Result<(), SubscribeServiceErr>;
}
pub struct SubscribeService<T: IDatabase> {
    db: Arc<T>,
}

impl<T> SubscribeService<T>
where
    T: IDatabase,
{
    pub fn new(db: Arc<T>) -> Self {
        Self { db }
    }
}

#[async_trait]
impl<T> ISubscribeService for SubscribeService<T>
where
    T: IDatabase + Send + Sync,
{
    async fn subscribe_user(
        &self,
        subscriber_id: i64,
        user_id: i64,
    ) -> Result<(), SubscribeServiceErr> {
        sqlx::query!(
            "insert into user_subscribers (user_id, subscriber_id) values ($1, $2)",
            user_id,
            subscriber_id
        )
        .execute(self.db.get_pool())
        .await
        .map(|_| ())
        .map_err(|e| match e {
            Error::Database(e) if e.is_foreign_key_violation() => SubscribeServiceErr::InvalidUser,
            _ => SubscribeServiceErr::Other(e.into()),
        })
    }

    async fn unsubscribe_user(
        &self,
        subscriber_id: i64,
        user_id: i64,
    ) -> Result<(), SubscribeServiceErr> {
        sqlx::query!(
            "delete from user_subscribers where user_id = $1 and subscriber_id = $2",
            user_id,
            subscriber_id
        )
        .execute(self.db.get_pool())
        .await
        .map(|_| ())
        .map_err(|e| SubscribeServiceErr::Other(e.into()))
    }
}
