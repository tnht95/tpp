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
            "insert into user_subscribers (user_id, subscriber_id) values ($1, $2) on conflict do nothing",
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

#[cfg(test)]
mod tests {
    use std::sync::Arc;

    use sqlx::{Pool, Postgres};

    use crate::{
        database::Database,
        services::subscribe::{ISubscribeService, SubscribeService},
    };

    #[sqlx::test]
    async fn subscribe_and_unsubscribe(pool: Pool<Postgres>) {
        let service: &dyn ISubscribeService =
            &SubscribeService::new(Arc::new(Database::new(pool.clone())));

        sqlx::query!("INSERT INTO users (id, name, github_url, avatar, bio)
                      VALUES (1, 'YourUsername', 'https://github.com/YourUsername', 'https://avatar-url.com', 'User Bio');").execute(&pool)
            .await
            .unwrap();

        service.subscribe_user(1, 40195902).await.unwrap();

        let subscription = sqlx::query!(
            "select 1 as res from user_subscribers where subscriber_id = 1 and user_id = 40195902"
        )
        .fetch_optional(&pool)
        .await
        .unwrap();

        assert!(subscription.is_some());

        service.unsubscribe_user(1, 40195902).await.unwrap();

        let subscription = sqlx::query!(
            "select 1 as res from user_subscribers where subscriber_id = 1 and user_id = 40195902"
        )
        .fetch_optional(&pool)
        .await
        .unwrap();

        assert!(subscription.is_none());
    }
}
