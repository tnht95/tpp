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
    async fn sync_user(&self, user: &User) -> Result<User, UserServiceErr>;
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
        match sqlx::query_as!(
            User,
            "
INSERT INTO users (id, name, avatar, github_url, bio, updated_at, created_at)
VALUES ($1, $2, $3, $4, $5, now(), now())
ON CONFLICT (id) DO UPDATE
SET name = $2, avatar = $3, github_url = $4, bio = $5, updated_at = now()
RETURNING *;
            ",
            user.id,
            user.name,
            user.avatar,
            user.github_url,
            user.bio,
        )
        .fetch_one(self.db.get_pool())
        .await
        {
            Ok(user) => Ok(user),
            Err(e) => Err(UserServiceErr::Other(e.into())),
        }
    }
}
