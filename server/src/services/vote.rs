use std::sync::Arc;

use async_trait::async_trait;
use sqlx::{Error, Transaction};
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
        new_vote: AddVoteRequest,
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
        new_vote: AddVoteRequest,
    ) -> Result<(), VoteServiceErr> {
        let mut tx = self
            .db
            .get_pool()
            .begin()
            .await
            .map_err(|e| VoteServiceErr::Other(e.into()))?;

        // Pre-handle the first vote case
        let (vote_column, other_vote_column) = match new_vote.is_up {
            true => ("up_votes", "down_votes"),
            false => ("down_votes", "up_votes"),
        };

        update_game_votes(&mut tx, game_id, vote_column, 1).await?;

        let result = sqlx::query!(
            r#"
            with existing_vote as (
                select is_up
                from votes
                where game_id = $1 and user_id = $2
            )
            , updated_vote as (
                insert into votes (game_id, user_id, is_up)
                values ($1, $2, $3)
                on conflict (game_id, user_id)
                do update set is_up = excluded.is_up, updated_at = now()
            )
            select existing_vote.is_up as existed_is_up
            from existing_vote
            "#,
            game_id,
            user_id,
            new_vote.is_up
        )
        .fetch_optional(&mut *tx)
        .await
        .map_err(|e| match e {
            Error::Database(e) if e.is_foreign_key_violation() => VoteServiceErr::InvalidGame,
            _ => VoteServiceErr::Other(e.into()),
        })?;

        // Handle the case where there is a conflict (not the first time vote)
        if let Some(r) = &result {
            match r.existed_is_up == new_vote.is_up {
                false => {
                    // case when vote changed
                    update_game_votes(&mut tx, game_id, other_vote_column, -1).await?;
                }
                true => {
                    // case when same vote
                    update_game_votes(&mut tx, game_id, vote_column, -1).await?;
                }
            }
        };

        tx.commit()
            .await
            .map_err(|e| VoteServiceErr::Other(e.into()))
    }

    async fn un_vote(&self, game_id: Uuid, user_id: i64) -> Result<(), VoteServiceErr> {
        let mut tx = self
            .db
            .get_pool()
            .begin()
            .await
            .map_err(|e| VoteServiceErr::Other(e.into()))?;

        let result = sqlx::query!(
            "delete from votes where game_id = $1 and user_id = $2 returning is_up",
            game_id,
            user_id
        )
        .fetch_optional(&mut *tx)
        .await
        .map_err(|e| VoteServiceErr::Other(e.into()))?;

        if let Some(result) = result {
            let vote_column = match result.is_up {
                true => "up_votes",
                false => "down_votes",
            };

            update_game_votes(&mut tx, game_id, vote_column, -1).await?;
        }

        tx.commit()
            .await
            .map_err(|e| VoteServiceErr::Other(e.into()))
    }
}

async fn update_game_votes(
    tx: &mut Transaction<'_, sqlx::Postgres>,
    game_id: Uuid,
    column: &str,
    update_value: i64,
) -> Result<(), VoteServiceErr> {
    let query = format!(
        "update games set {} = {} + $1, updated_at = now() where id = $2",
        column, column
    );
    sqlx::query(&query)
        .bind(update_value)
        .bind(game_id)
        .execute(&mut **tx)
        .await
        .map_err(|e| VoteServiceErr::Other(e.into()))
        .map(|_| ())
}
