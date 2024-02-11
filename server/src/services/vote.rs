use std::sync::Arc;

use async_trait::async_trait;
use sqlx::Error;
use thiserror::Error;
use uuid::Uuid;

use crate::{database::IDatabase, model::requests::vote::AddVoteRequest};

#[derive(Error, Debug)]
pub enum VoteServiceErr {
    #[error(transparent)]
    Other(#[from] anyhow::Error),
    #[error("InvalidGame")]
    InvalidGame,
}

#[async_trait]
pub trait IVoteService {
    async fn vote(
        &self,
        game_id: Uuid,
        user_id: i64,
        vote: AddVoteRequest,
    ) -> Result<(), VoteServiceErr>;
    async fn un_vote(&self, game_id: Uuid, user_id: i64) -> Result<(), VoteServiceErr>;
}

pub struct VoteService<T: IDatabase> {
    db: Arc<T>,
}

impl<T> VoteService<T>
where
    T: IDatabase,
{
    pub fn new(db: Arc<T>) -> Self {
        Self { db }
    }
}

#[async_trait]
impl<T> IVoteService for VoteService<T>
where
    T: IDatabase + Send + Sync,
{
    async fn vote(
        &self,
        game_id: Uuid,
        user_id: i64,
        vote: AddVoteRequest,
    ) -> Result<(), VoteServiceErr> {
        let mut tx = self
            .db
            .get_pool()
            .begin()
            .await
            .map_err(|e| VoteServiceErr::Other(e.into()))?;

        sqlx::query!(
            r#"
            INSERT INTO votes (user_id, game_id, is_up)
            VALUES ($1, $2, $3)
            ON CONFLICT (user_id, game_id)
            DO UPDATE SET is_up = $3
            "#,
            user_id,
            game_id,
            vote.is_up
        )
        .execute(&mut *tx)
        .await
        .map_err(|e| match e {
            Error::Database(e) if e.is_foreign_key_violation() => VoteServiceErr::InvalidGame,
            _ => VoteServiceErr::Other(e.into()),
        })?;

        let vote_column = match vote.is_up {
            true => "up_votes",
            false => "down_votes",
        };

        let query = format!(
            "UPDATE games SET {} = {} + 1 WHERE id = $1",
            vote_column, vote_column
        );

        sqlx::query(&query)
            .bind(game_id)
            .execute(&mut *tx)
            .await
            .map_err(|e| VoteServiceErr::Other(e.into()))?;

        tx.commit()
            .await
            .map_err(|e| VoteServiceErr::Other(e.into()))
    }

    async fn un_vote(&self, game_id: Uuid, user_id: i64) -> Result<(), VoteServiceErr> {
        sqlx::query!(
            "delete from votes where game_id = $1 and user_id = $2",
            game_id,
            user_id
        )
        .execute(self.db.get_pool())
        .await
        .map(|_| ())
        .map_err(|e| VoteServiceErr::Other(e.into()))
    }
}
