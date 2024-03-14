use std::sync::Arc;

use async_trait::async_trait;
use thiserror::Error;

use crate::{
    database::{entities::like::LikeType, IDatabase},
    model::requests::like::{AddLikeRequest, DeleteLikeRequest},
};

#[derive(Error, Debug)]
pub enum LikeServiceErr {
    #[error(transparent)]
    Other(#[from] anyhow::Error),
}

#[async_trait]
pub trait ILikeService {
    async fn like(&self, user_id: i64, like: AddLikeRequest) -> Result<(), LikeServiceErr>;
    async fn unlike(&self, user_id: i64, like: DeleteLikeRequest) -> Result<(), LikeServiceErr>;
}

pub struct LikeService<T: IDatabase> {
    db: Arc<T>,
}

impl<T> LikeService<T>
where
    T: IDatabase,
{
    pub fn new(db: Arc<T>) -> Self {
        Self { db }
    }
}

#[async_trait]
impl<T> ILikeService for LikeService<T>
where
    T: IDatabase + Send + Sync,
{
    async fn like(&self, user_id: i64, like: AddLikeRequest) -> Result<(), LikeServiceErr> {
        sqlx::query!(
            "select insert_like($1, $2, $3)",
            user_id,
            like.target_id,
            like.target_type as LikeType
        )
        .execute(self.db.get_pool())
        .await
        .map(|_| ())
        .map_err(|e| LikeServiceErr::Other(e.into()))
    }

    async fn unlike(&self, user_id: i64, like: DeleteLikeRequest) -> Result<(), LikeServiceErr> {
        sqlx::query!(
            "select delete_like($1, $2, $3)",
            user_id,
            like.target_id,
            like.target_type as LikeType
        )
        .execute(self.db.get_pool())
        .await
        .map(|_| ())
        .map_err(|e| LikeServiceErr::Other(e.into()))
    }
}

#[cfg(test)]
mod tests {
    use std::sync::Arc;

    use sqlx::{Pool, Postgres};

    use crate::{
        database::{entities::like::LikeType, Database},
        model::requests::like::{AddLikeRequest, DeleteLikeRequest},
        services::like::{ILikeService, LikeService},
    };

    #[sqlx::test]
    async fn like_and_unlike(pool: Pool<Postgres>) {
        let service: &dyn ILikeService = &LikeService::new(Arc::new(Database::new(pool.clone())));

        sqlx::query!("INSERT INTO comments (id, user_id, user_name, target_id, content, target_type)
                      VALUES ('b203622d-413d-4d53-bd2d-9ebd00576d37', 40195902, 'tnht95', '57770708-2694-4bca-a332-c4c44ed2daa3', 'Comment Content', 'posts');")
            .execute(&pool)
            .await
            .unwrap();

        service
            .like(
                40195902,
                AddLikeRequest {
                    target_id: "b203622d-413d-4d53-bd2d-9ebd00576d37".parse().unwrap(),
                    target_type: LikeType::Comments,
                },
            )
            .await
            .unwrap();

        let res =  sqlx::query!("select 1 as res from likes where target_id = 'b203622d-413d-4d53-bd2d-9ebd00576d37' and user_id = 40195902").fetch_optional(&pool)
            .await
            .unwrap();

        assert!(res.is_some());

        //test unlike
        service
            .unlike(
                40195902,
                DeleteLikeRequest {
                    target_id: "b203622d-413d-4d53-bd2d-9ebd00576d37".parse().unwrap(),
                    target_type: LikeType::Comments,
                },
            )
            .await
            .unwrap();

        let res =  sqlx::query!("select 1 as res from likes where target_id = 'b203622d-413d-4d53-bd2d-9ebd00576d37' and user_id = 40195902").fetch_optional(&pool)
            .await
            .unwrap();

        assert!(res.is_none());
    }

    #[sqlx::test]
    async fn like_and_unlike_nonexistent_target(pool: Pool<Postgres>) {
        let service: &dyn ILikeService = &LikeService::new(Arc::new(Database::new(pool.clone())));

        service
            .like(
                40195902,
                AddLikeRequest {
                    target_id: "b203622d-413d-4d53-bd2d-9ebd00576d37".parse().unwrap(),
                    target_type: LikeType::Comments,
                },
            )
            .await
            .unwrap();

        let res =  sqlx::query!("select 1 as res from likes where target_id = 'b203622d-413d-4d53-bd2d-9ebd00576d37' and user_id = 40195902").fetch_optional(&pool)
            .await
            .unwrap();

        assert!(res.is_none());

        //test unlike
        service
            .unlike(
                40195902,
                DeleteLikeRequest {
                    target_id: "b203622d-413d-4d53-bd2d-9ebd00576d37".parse().unwrap(),
                    target_type: LikeType::Comments,
                },
            )
            .await
            .unwrap();

        let res =  sqlx::query!("select 1 as res from likes where target_id = 'b203622d-413d-4d53-bd2d-9ebd00576d37' and user_id = 40195902").fetch_optional(&pool)
            .await
            .unwrap();

        assert!(res.is_none());
    }
}
