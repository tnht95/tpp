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
                and ($2 = uuid_nil() or target_id = $2)
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

#[cfg(test)]
mod tests {
    use sqlx::{Pool, Postgres};

    use super::*;
    use crate::database::Database;

    #[sqlx::test]
    async fn filter_notis(pool: Pool<Postgres>) {
        let post_id = uuid::Uuid::new_v4();
        sqlx::query!(
            "insert into activities(user_id, target_type, target_id, memo, created_at) values
            (40195902, 'added_game', uuid_generate_v4(), 'memaw1', now()),
            (40195902, 'updated_game', uuid_generate_v4(), 'memaw2', now() + interval '1 second'),
            (40195902, 'post', $1, 'memaw3', now() + interval '2 seconds')",
            post_id
        )
        .execute(&pool)
        .await
        .unwrap();

        let service: &dyn IActivityService =
            &ActivityService::new(Arc::new(Database::new(pool.clone())));

        let activities = service
            .filter(
                40195902,
                PaginationWithTargetInternal {
                    target_id: post_id,
                    offset: 0,
                    limit: 2,
                },
            )
            .await
            .unwrap();

        assert_eq!(activities.len(), 1);
        assert_eq!(activities[0].user_id, 40195902);
        assert_eq!(activities[0].target_type, ActivityType::Post);
        assert_eq!(activities[0].target_id, post_id);
        assert_eq!(activities[0].memo, "memaw3");

        let activities = service
            .filter(
                40195902,
                PaginationWithTargetInternal {
                    target_id: uuid::Uuid::nil(),
                    offset: 0,
                    limit: 3,
                },
            )
            .await
            .unwrap();

        assert_eq!(activities.len(), 3);
        assert_eq!(activities[0].user_id, 40195902);
        assert_eq!(activities[0].target_type, ActivityType::Post);
        assert_eq!(activities[0].target_id, post_id);
        assert_eq!(activities[0].memo, "memaw3");

        assert_eq!(activities[1].user_id, 40195902);
        assert_eq!(activities[1].target_type, ActivityType::UpdatedGame);
        assert!(!activities[1].target_id.is_nil());
        assert_eq!(activities[1].memo, "memaw2");

        assert_eq!(activities[2].user_id, 40195902);
        assert_eq!(activities[2].target_type, ActivityType::AddedGame);
        assert!(!activities[2].target_id.is_nil());
        assert_eq!(activities[2].memo, "memaw1");
    }
}
