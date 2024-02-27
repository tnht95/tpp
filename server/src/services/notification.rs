use std::sync::Arc;

use async_trait::async_trait;
use thiserror::Error;

use crate::{
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
    async fn listen(&self, channel: &str) -> Result<(), NofitifcationServiceErr>;
}

pub struct NofitifcationService<T: IDatabase> {
    db: Arc<T>,
}

impl<T> NofitifcationService<T>
where
    T: IDatabase,
{
    pub fn new(db: Arc<T>) -> Self {
        Self { db }
    }
}

#[async_trait]
impl<T> INofitifcationService for NofitifcationService<T>
where
    T: IDatabase + Send + Sync,
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
            order by created_at desc offset $2 limit $3
            "#,
            user_id,
            pagination.offset,
            pagination.limit
        )
        .fetch_all(self.db.get_pool())
        .await
        .map_err(|e| NofitifcationServiceErr::Other(e.into()))
    }

    async fn listen(&self, channel: &str) -> Result<(), NofitifcationServiceErr> {
        let mut listener = sqlx::postgres::PgListener::connect_with(self.db.get_pool())
            .await
            .map_err(|e| NofitifcationServiceErr::Other(e.into()))?;
        listener
            .listen(channel)
            .await
            .map_err(|e| NofitifcationServiceErr::Other(e.into()))?;
        while let Some(notification) = listener
            .try_recv()
            .await
            .map_err(|e| NofitifcationServiceErr::Other(e.into()))?
        {
            println!(
                "Received notification on channel '{}': {}",
                notification.channel(),
                notification.payload()
            );
            // Handle the notification payload as needed
        }
        // connection lost, do something interesting
        println!("connection lost");
        Ok(())
    }
}
