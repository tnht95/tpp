use std::sync::Arc;

use async_trait::async_trait;
use thiserror::Error;

use crate::database::{entities::user::User, IDatabase};

#[derive(Error, Debug)]
pub enum UserServiceErr {
    #[error(transparent)]
    Other(#[from] anyhow::Error),
}

#[async_trait]
pub trait IUserService {
    async fn sync_user(&self, user: &User) -> Result<User, UserServiceErr>;
    async fn get_by_id(&self, id: i64) -> Result<Option<User>, UserServiceErr>;
}

pub struct UserService<T: IDatabase> {
    db: Arc<T>,
}

impl<T> UserService<T>
where
    T: IDatabase,
{
    pub fn new(db: Arc<T>) -> Self {
        Self { db }
    }
}

#[async_trait]
impl<T> IUserService for UserService<T>
where
    T: IDatabase + Send + Sync,
{
    async fn sync_user(&self, user: &User) -> Result<User, UserServiceErr> {
        sqlx::query_as!(
            User,
            "insert into users (id, name, avatar, github_url, bio)
            values ($1, $2, $3, $4, $5)
            on conflict (id) do update
            set name = $2, avatar = $3, github_url = $4, bio = $5, updated_at = now()
            returning *;",
            user.id,
            user.name,
            user.avatar,
            user.github_url,
            user.bio,
        )
        .fetch_one(self.db.get_pool())
        .await
        .map_err(|e| UserServiceErr::Other(e.into()))
    }

    async fn get_by_id(&self, id: i64) -> Result<Option<User>, UserServiceErr> {
        sqlx::query_as!(User, "select * from users where id = $1", id)
            .fetch_optional(self.db.get_pool())
            .await
            .map_err(|e| UserServiceErr::Other(e.into()))
    }
}
