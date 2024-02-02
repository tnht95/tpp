use std::{future::Future, pin::Pin, sync::Arc};

use async_trait::async_trait;
use sqlx::{Postgres, QueryBuilder};
use thiserror::Error;
use uuid::Uuid;

use crate::{
    database::{
        entities::game::{Game, GameSummary},
        IDatabase,
    },
    model::requests::game::{AddGameRequest, GameQuery},
};

#[derive(Error, Debug)]
pub enum GameServiceErr {
    #[error(transparent)]
    Other(#[from] anyhow::Error),
}

#[async_trait]
pub trait IGameService {
    async fn filter(&self, query: GameQuery) -> Result<Vec<GameSummary>, GameServiceErr>;
    async fn get_by_id(&self, id: Uuid) -> Result<Option<Game>, GameServiceErr>;
    async fn add<
        F: Send + Fn(Uuid) -> Pin<Box<dyn Future<Output = Result<String, anyhow::Error>> + Send>>,
    >(
        &self,
        author_id: i64,
        author_name: String,
        game: AddGameRequest,
        rom_path_cb: F,
    ) -> Result<Game, GameServiceErr>;
    async fn delete(&self, id: Uuid) -> Result<(), GameServiceErr>;
    async fn existed(&self, id: Uuid, author_id: i64) -> Result<bool, GameServiceErr>;
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
    async fn filter(&self, query: GameQuery) -> Result<Vec<GameSummary>, GameServiceErr> {
        let mut query_builder: QueryBuilder<Postgres> = QueryBuilder::new("");

        let mut separated = query_builder.separated(" ");
        separated.push("select * from games where 1 = 1");

        if let Some(author_id) = query.author_id {
            separated.push("and author_id =");
            separated.push_bind(author_id);
        }

        if let Some(tag) = query.tag {
            separated.push("and");
            separated.push_bind(tag);
            separated.push("= any(tags)");
        }

        if let Some(order_by) = query.order_by {
            if let Some(order_field) = query.order_field {
                separated.push(format!("order by {} {}", order_field, order_by));
            }
        }

        if let Some(offset) = query.offset {
            separated.push("offset");
            separated.push_bind(offset);
        }

        if let Some(limit) = query.limit {
            separated.push("limit");
            separated.push_bind(limit);
        }

        match query_builder
            .build_query_as::<GameSummary>()
            .fetch_all(self.db.get_pool())
            .await
        {
            Ok(games) => Ok(games),
            Err(e) => Err(GameServiceErr::Other(e.into())),
        }
    }

    async fn get_by_id(&self, id: Uuid) -> Result<Option<Game>, GameServiceErr> {
        match sqlx::query_as!(Game, "select * from games where id = $1", id)
            .fetch_optional(self.db.get_pool())
            .await
        {
            Ok(game) => Ok(game),
            Err(e) => Err(GameServiceErr::Other(e.into())),
        }
    }

    async fn add<
        F: Send + Fn(Uuid) -> Pin<Box<dyn Future<Output = Result<String, anyhow::Error>> + Send>>,
    >(
        &self,
        author_id: i64,
        author_name: String,
        game: AddGameRequest,
        rom_path_cb: F,
    ) -> Result<Game, GameServiceErr> {
        let mut tx = self
            .db
            .get_pool()
            .begin()
            .await
            .map_err(|e| GameServiceErr::Other(e.into()))?;

        let game = sqlx::query!(
            r#"insert into games
            (name, author_id, author_name, url, avatar_url, about, info, stars, tags, rom) values
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, '')
            returning id"#,
            game.name,
            author_id,
            author_name,
            game.url,
            game.avatar_url,
            game.about,
            game.info,
            0,
            game.tags.as_deref(),
        )
        .fetch_one(&mut *tx)
        .await
        .map_err(|e| GameServiceErr::Other(e.into()))?;

        let rom_path = rom_path_cb(game.id).await.map_err(GameServiceErr::Other)?;

        let game = sqlx::query_as!(
            Game,
            "update games set rom = $1 where id = $2 returning *",
            rom_path,
            game.id
        )
        .fetch_one(&mut *tx)
        .await
        .map_err(|e| GameServiceErr::Other(e.into()))?;

        tx.commit()
            .await
            .map_err(|e| GameServiceErr::Other(e.into()))?;

        Ok(game)
    }

    async fn delete(&self, id: Uuid) -> Result<(), GameServiceErr> {
        match sqlx::query!("delete from games where id = $1", id)
            .execute(self.db.get_pool())
            .await
        {
            Ok(_) => Ok(()),
            Err(e) => Err(GameServiceErr::Other(e.into())),
        }
    }

    async fn existed(&self, id: Uuid, author_id: i64) -> Result<bool, GameServiceErr> {
        match sqlx::query!(
            "select count(*) as game_count from games where id = $1 and author_id = $2",
            id,
            author_id
        )
        .fetch_one(self.db.get_pool())
        .await
        {
            Ok(result) => match result.game_count {
                None => Ok(false),
                Some(count) => Ok(count > 0),
            },
            Err(e) => Err(GameServiceErr::Other(e.into())),
        }
    }
}
