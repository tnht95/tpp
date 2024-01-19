use std::sync::Arc;

use async_trait::async_trait;
use thiserror::Error;

use crate::database::{entities::users::User, IDatabase};

#[derive(Error, Debug)]
pub enum UserServiceErr {
    #[error(transparent)]
    Other(#[from] anyhow::Error),
}

#[async_trait]
pub trait IUserService {
    async fn sync_user(&self, user: &User) -> Result<(), UserServiceErr>;
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
    async fn sync_user(&self, user: &User) -> Result<(), UserServiceErr> {
        match sqlx::query!(
            "
INSERT INTO users (id, name, avatar, github_url, bio, updated_at, created_at)
VALUES ($1, $2, $3, $4, $5, $6, $7)
ON CONFLICT (id) DO UPDATE
SET name = EXCLUDED.name, avatar = EXCLUDED.avatar, github_url = EXCLUDED.github_url, bio = EXCLUDED.bio, updated_at = EXCLUDED.updated_at
            ",
            user.id,
            user.name,
            user.avatar,
            user.github_url,
            user.bio,
            user.updated_at,
            user.created_at
            )
            .fetch_optional(self.db.get_pool())
            .await
        {
            Ok(_) => Ok(()),
            Err(e) => Err(UserServiceErr::Other(e.into())),
        }
    }
}
