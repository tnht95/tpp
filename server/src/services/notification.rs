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

#[cfg(test)]
mod tests {
    use anyhow::Result;
    use redis::aio::MultiplexedConnection;
    use sqlx::{Pool, Postgres};

    use super::*;
    use crate::database::Database;

    struct CacheMock {}

    #[async_trait]
    impl ICache for CacheMock {
        fn get_con(&self) -> MultiplexedConnection {
            todo!()
        }
        fn get_exp(&self) -> u64 {
            todo!()
        }
        async fn ping(&self) -> Result<String> {
            todo!()
        }
        async fn is_healthy(&self) -> Result<bool> {
            todo!()
        }
    }

    #[sqlx::test]
    async fn filter_notis(pool: Pool<Postgres>) {
        sqlx::query!(
            "insert into users (id, name, github_url, avatar, bio) values
            (1, 'JohnDoe', 'JohnDoe_url', 'JohnDoe_avatar', 'Software Developer'),
            (2, 'JaneSmith', 'JaneSmith_url', 'JaneSmith_avatar', 'Data Scientist'),
            (3, 'BobJohnson', 'BobJohnson_url', 'BobJohnson_avatar', null)"
        )
        .execute(&pool)
        .await
        .unwrap();

        sqlx::query!(
            "insert into notis(id, to_user_id, by_user_id, by_user_name, by_object_id, target_type, target_id, parent_target_id) values
            (1, 40195902, 1, 'JohnDoe', uuid_generate_v4(), 'like_post', uuid_generate_v4(), null),
            (2, 40195902, 1, 'JohnDoe', uuid_generate_v4(), 'like_discussion', uuid_generate_v4(), null),
            (3, 40195902, 1, 'JohnDoe', uuid_generate_v4(), 'like_comment_blog', uuid_generate_v4(), null),
            (4, 40195902, 2, 'JaneSmith', uuid_generate_v4(), 'like_comment_post', uuid_generate_v4(), null),
            (5, 40195902, 2, 'JaneSmith', uuid_generate_v4(), 'like_comment_discussion', uuid_generate_v4(), null),
            (6, 40195902, 2, 'JaneSmith', uuid_generate_v4(), 'comment_blog', uuid_generate_v4(), null),
            (7, 40195902, 3, 'BobJohnson', uuid_generate_v4(), 'comment_post', uuid_generate_v4(), null),
            (8, 40195902, 3, 'BobJohnson', uuid_generate_v4(), 'comment_discussion', uuid_generate_v4(), null),
            (9, 40195902, 3, 'BobJohnson', uuid_generate_v4(), 'comment_tag_blog', uuid_generate_v4(), null),
            (10, 40195902, 1, 'JohnDoe', uuid_generate_v4(), 'comment_tag_post', uuid_generate_v4(), null),
            (11, 40195902, 1, 'JohnDoe', uuid_generate_v4(), 'comment_tag_discussion', uuid_generate_v4(), null),
            (12, 40195902, 1, 'JohnDoe', uuid_generate_v4(), 'game_discussion', uuid_generate_v4(), null),
            (13, 40195902, 2, 'JaneSmith', uuid_generate_v4(), 'subscribe', uuid_generate_v4(), null),
            (14, 40195902, 2, 'JaneSmith', uuid_generate_v4(), 'user_added_game', uuid_generate_v4(), null),
            (15, 40195902, 2, 'JaneSmith', uuid_generate_v4(), 'user_updated_game', uuid_generate_v4(), null),
            (16, 40195902, 3, 'BobJohnson', uuid_generate_v4(), 'user_post', uuid_generate_v4(), null),
            (17, 40195902, 3, 'BobJohnson', uuid_generate_v4(), 'vote_game', uuid_generate_v4(), null)")
            .execute(&pool).await.unwrap();

        let service: &dyn INofitifcationService = &NofitifcationService::new(
            Arc::new(Database::new(pool.clone())),
            Arc::new(CacheMock {}),
        );

        let notis = service
            .filter(
                4,
                PaginationInternal {
                    offset: 0,
                    limit: 1,
                },
            )
            .await
            .unwrap();

        assert_eq!(notis.len(), 0);

        let notis = service
            .filter(
                40195902,
                PaginationInternal {
                    offset: 0,
                    limit: 5,
                },
            )
            .await
            .unwrap();

        assert_eq!(notis.len(), 5);
        assert_eq!(notis[0].id, 17);
        assert_eq!(notis[0].to_user_id, 40195902);
        assert_eq!(notis[0].by_user_id, 3);
        assert_eq!(notis[0].by_user_name, "BobJohnson");
        assert_eq!(notis[0].by_user_name_avatar, "BobJohnson_avatar");
        assert!(!notis[0].by_object_id.is_nil());
        assert_eq!(notis[0].target_type, NotificationType::VoteGame);
        assert!(!notis[0].target_id.is_nil());
        assert!(notis[0].parent_target_id.is_none());
        assert!(!notis[0].is_read);

        let notis = service
            .filter(
                40195902,
                PaginationInternal {
                    offset: 15,
                    limit: 3,
                },
            )
            .await
            .unwrap();

        assert_eq!(notis.len(), 2);

        assert_eq!(notis[0].id, 2);
        assert_eq!(notis[0].to_user_id, 40195902);
        assert_eq!(notis[0].by_user_id, 1);
        assert_eq!(notis[0].by_user_name, "JohnDoe");
        assert_eq!(notis[0].by_user_name_avatar, "JohnDoe_avatar");
        assert!(!notis[0].by_object_id.is_nil());
        assert_eq!(notis[0].target_type, NotificationType::LikeDiscussion);
        assert!(!notis[0].target_id.is_nil());
        assert!(notis[0].parent_target_id.is_none());
        assert!(!notis[0].is_read);

        assert_eq!(notis[1].id, 1);
        assert_eq!(notis[1].to_user_id, 40195902);
        assert_eq!(notis[1].by_user_id, 1);
        assert_eq!(notis[1].by_user_name, "JohnDoe");
        assert_eq!(notis[1].by_user_name_avatar, "JohnDoe_avatar");
        assert!(!notis[1].by_object_id.is_nil());
        assert_eq!(notis[1].target_type, NotificationType::LikePost);
        assert!(!notis[1].target_id.is_nil());
        assert!(notis[1].parent_target_id.is_none());
        assert!(!notis[1].is_read);
    }

    #[sqlx::test]
    async fn read_noti(pool: Pool<Postgres>) {
        sqlx::query!(
            "insert into users (id, name, github_url, avatar, bio) values
            (1, 'JohnDoe', 'JohnDoe_url', 'JohnDoe_avatar', 'Software Developer')"
        )
        .execute(&pool)
        .await
        .unwrap();

        sqlx::query!(
            "insert into notis(id, to_user_id, by_user_id, by_user_name, by_object_id, target_type, target_id, parent_target_id) values
            (1, 40195902, 1, 'JohnDoe', uuid_generate_v4(), 'like_post', uuid_generate_v4(), uuid_generate_v4())"
        )
        .execute(&pool)
        .await
        .unwrap();

        let service: &dyn INofitifcationService = &NofitifcationService::new(
            Arc::new(Database::new(pool.clone())),
            Arc::new(CacheMock {}),
        );

        service.read(1, 40195902).await.unwrap();

        let noti = sqlx::query!(
            r#"
            select
                id,
                to_user_id,
                by_user_id,
                by_user_name,
                by_object_id,
                target_type as "target_type!: NotificationType",
                target_id,
                parent_target_id,
                is_read
            from notis
            where id = 1"#
        )
        .fetch_one(&pool)
        .await
        .unwrap();

        assert_eq!(noti.id, 1);
        assert_eq!(noti.to_user_id, 40195902);
        assert_eq!(noti.by_user_id, 1);
        assert_eq!(noti.by_user_name, "JohnDoe");
        assert!(!noti.by_object_id.is_nil());
        assert_eq!(noti.target_type, NotificationType::LikePost);
        assert!(!noti.target_id.is_nil());
        assert!(noti.parent_target_id.is_some());
        assert!(noti.is_read);
    }
}
