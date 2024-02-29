use std::sync::Arc;

use async_trait::async_trait;
use redis::AsyncCommands;
use thiserror::Error;
use tokio::sync::mpsc::Sender;

use crate::{
    cache::ICache,
    database::{entities::notification::NotificationType, IDatabase},
    model::{requests::PaginationInternal, responses::notification::Notification},
};

#[derive(Error, Debug)]
pub enum NofitifcationServiceErr {
    #[error(transparent)]
    Other(#[from] anyhow::Error),
}

#[async_trait]
pub trait INofitifcationService {
    async fn filter(
        &self,
        user_id: i64,
        pagination: PaginationInternal,
    ) -> Result<Vec<Notification>, NofitifcationServiceErr>;
    async fn is_check(&self, user_id: i64) -> Result<bool, NofitifcationServiceErr>;
    async fn check(&self, user_id: i64) -> Result<(), NofitifcationServiceErr>;
    async fn read(&self, id: i64, user_id: i64) -> Result<(), NofitifcationServiceErr>;
    async fn listen(
        &self,
        channel: &str,
        sender: Sender<String>,
    ) -> Result<(), NofitifcationServiceErr>;
}

pub struct NofitifcationService<TDb: IDatabase, TCache: ICache> {
    db: Arc<TDb>,
    cache: Arc<TCache>,
}

impl<TDb, TCache> NofitifcationService<TDb, TCache>
where
    TDb: IDatabase,
    TCache: ICache,
{
    pub fn new(db: Arc<TDb>, cache: Arc<TCache>) -> Self {
        Self { db, cache }
    }

    fn build_cache_key(&self, user_id: i64) -> String {
        format!("is_check_{user_id}")
    }
}

#[async_trait]
impl<TDb, TCache> INofitifcationService for NofitifcationService<TDb, TCache>
where
    TDb: IDatabase + Sync + Send,
    TCache: ICache + Sync + Send,
{
    async fn filter(
        &self,
        user_id: i64,
        pagination: PaginationInternal,
    ) -> Result<Vec<Notification>, NofitifcationServiceErr> {
        sqlx::query_as!(
            Notification,
            r#"
            select
                notis.id,
                notis.to_user_id,
                notis.by_user_id,
                notis.by_user_name,
                users.avatar as "by_user_name_avatar",
                notis.by_object_id,
                notis.target_type as "target_type!: NotificationType",
                notis.target_id,
                notis.parent_target_id,
                notis.is_read,
                notis.created_at
            from notis
            left join users on users.id = notis.by_user_id
            where
                to_user_id = $1
            order by id desc offset $2 limit $3
            "#,
            user_id,
            pagination.offset,
            pagination.limit
        )
        .fetch_all(self.db.get_pool())
        .await
        .map_err(|e| NofitifcationServiceErr::Other(e.into()))
    }

    async fn listen(
        &self,
        channel: &str,
        sender: Sender<String>,
    ) -> Result<(), NofitifcationServiceErr> {
        let mut pg_listener = sqlx::postgres::PgListener::connect_with(self.db.get_pool())
            .await
            .map_err(|e| NofitifcationServiceErr::Other(e.into()))?;

        pg_listener
            .listen(channel)
            .await
            .map_err(|e| NofitifcationServiceErr::Other(e.into()))?;

        let mut cache_connection = self.cache.get_con();

        while let Some(notification) = pg_listener
            .try_recv()
            .await
            .map_err(|e| NofitifcationServiceErr::Other(e.into()))?
        {
            let noti = serde_json::from_str::<Notification>(notification.payload())
                .map_err(|e| NofitifcationServiceErr::Other(e.into()))?;

            let payload = serde_json::to_string(&noti)
                .map_err(|e| NofitifcationServiceErr::Other(e.into()))?;

            cache_connection
                .set(self.build_cache_key(noti.to_user_id), "0")
                .await
                .map_err(|e| NofitifcationServiceErr::Other(e.into()))?;

            sender
                .send(payload)
                .await
                .map_err(|e| NofitifcationServiceErr::Other(e.into()))?;
        }
        Ok(())
    }

    async fn is_check(&self, user_id: i64) -> Result<bool, NofitifcationServiceErr> {
        let mut cache_connection = self.cache.get_con();
        let is_check: Option<String> = cache_connection
            .get(self.build_cache_key(user_id))
            .await
            .map_err(|e| NofitifcationServiceErr::Other(e.into()))?;
        Ok(is_check.map(|c| c.eq("1")).unwrap_or(true))
    }

    async fn check(&self, user_id: i64) -> Result<(), NofitifcationServiceErr> {
        let mut cache_connection = self.cache.get_con();
        cache_connection
            .set(self.build_cache_key(user_id), "1")
            .await
            .map_err(|e| NofitifcationServiceErr::Other(e.into()))
    }

    async fn read(&self, id: i64, user_id: i64) -> Result<(), NofitifcationServiceErr> {
        sqlx::query!(
            "update notis set is_read = true where id = $1 AND to_user_id = $2",
            id,
            user_id,
        )
        .execute(self.db.get_pool())
        .await
        .map(|_| ())
        .map_err(|e| NofitifcationServiceErr::Other(e.into()))
    }
}
