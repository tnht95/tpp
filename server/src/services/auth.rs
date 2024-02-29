use std::sync::Arc;

use anyhow::anyhow;
use async_trait::async_trait;
use redis::AsyncCommands;
use thiserror::Error;

use crate::{cache::ICache, database::entities::user::User};

#[derive(Error, Debug)]
pub enum AuthServiceErr {
    #[error(transparent)]
    Other(#[from] anyhow::Error),
}

#[async_trait]
pub trait IAuthService {
    async fn issue_ws_ticket(&self, user: &User) -> Result<String, AuthServiceErr>;
    async fn get_ws_ticket(&self, ws_ticket: &str) -> Result<Option<(User, u64)>, AuthServiceErr>;
    async fn delete_ws_ticket(&self, ws_ticket: &str) -> Result<(), AuthServiceErr>;
}

pub struct AuthService<T: ICache> {
    cache: Arc<T>,
}

impl<T> AuthService<T>
where
    T: ICache,
{
    pub fn new(cache: Arc<T>) -> Self {
        Self { cache }
    }

    fn build_key(&self, ws_ticket: &str) -> String {
        format!("ws_ticket_{ws_ticket}")
    }
}

#[async_trait]
impl<T> IAuthService for AuthService<T>
where
    T: ICache + Send + Sync,
{
    async fn issue_ws_ticket(&self, user: &User) -> Result<String, AuthServiceErr> {
        let ws_ticket = uuid::Uuid::new_v4().to_string();
        let user_str =
            serde_json::to_string(user).map_err(|e| AuthServiceErr::Other(anyhow!(e)))?;
        let mut con = self.cache.get_con();
        con.set_ex(self.build_key(&ws_ticket), user_str, self.cache.get_exp())
            .await
            .map_err(|e| AuthServiceErr::Other(anyhow!(e)))?;
        Ok(ws_ticket)
    }

    async fn get_ws_ticket(&self, ws_ticket: &str) -> Result<Option<(User, u64)>, AuthServiceErr> {
        let mut con = self.cache.get_con();
        let (user_str, ttl): (Option<String>, u64) = redis::pipe()
            .atomic()
            .get(self.build_key(ws_ticket))
            .ttl(self.build_key(ws_ticket))
            .query_async(&mut con)
            .await
            .map_err(|e| AuthServiceErr::Other(anyhow!(e)))?;
        user_str.map_or_else(
            || Ok(None),
            |user_str| {
                serde_json::from_str::<User>(&user_str)
                    .map(|user| Some((user, ttl)))
                    .map_err(|e| AuthServiceErr::Other(anyhow!(e)))
            },
        )
    }

    async fn delete_ws_ticket(&self, ws_ticket: &str) -> Result<(), AuthServiceErr> {
        let mut con = self.cache.get_con();
        con.del(ws_ticket)
            .await
            .map_err(|e| AuthServiceErr::Other(anyhow!(e)))
    }
}
