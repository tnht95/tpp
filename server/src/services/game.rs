use std::sync::Arc;

use async_trait::async_trait;
use thiserror::Error;

use crate::database::{entities::game::Game, IDatabase};

#[derive(Error, Debug)]
pub enum GameServiceErr {
    #[error(transparent)]
    Other(#[from] anyhow::Error),
}

#[async_trait]
pub trait IGameService {
    async fn get_all(&self) -> Result<Vec<Game>, GameServiceErr>;
}

pub struct GameService<T: IDatabase> {
    db: Arc<T>,
}

impl<T> GameService<T>
where
    T: IDatabase,
{
    pub fn new(db: Arc<T>) -> Self {
        Self { db }
    }
}

#[async_trait]
impl<T> IGameService for GameService<T>
where
    T: IDatabase + Send + Sync,
{
    async fn get_all(&self) -> Result<Vec<Game>, GameServiceErr> {
        match sqlx::query_as!(Game, "SELECT * FROM games")
            .fetch_all(self.db.get_pool())
            .await
        {
            Ok(games) => Ok(games),
            Err(e) => Err(GameServiceErr::Other(e.into())),
        }
    }
}