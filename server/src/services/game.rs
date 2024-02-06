use std::sync::Arc;

use async_trait::async_trait;
use sqlx::{Postgres, QueryBuilder};
use thiserror::Error;
use tokio::fs::{create_dir, metadata, write};
use uuid::Uuid;

use crate::{
    database::{entities::game::Game, IDatabase},
    model::{
        requests::game::{AddGameRequest, GamePaginationInternal},
        responses::game::GameFiltered,
    },
};

#[derive(Error, Debug)]
pub enum GameServiceErr {
    #[error(transparent)]
    Other(#[from] anyhow::Error),
}

#[async_trait]
pub trait IGameService {
    async fn filter(
        &self,
        pagination: GamePaginationInternal,
    ) -> Result<Vec<GameFiltered>, GameServiceErr>;
    async fn get_by_id(&self, id: Uuid) -> Result<Option<Game>, GameServiceErr>;
    async fn add(
        &self,
        author_id: i64,
        author_name: String,
        game: AddGameRequest,
        rom_bytes: &[u8],
    ) -> Result<Game, GameServiceErr>;
    async fn delete(&self, id: Uuid) -> Result<(), GameServiceErr>;
    async fn existed(&self, id: Uuid, author_id: i64) -> Result<bool, GameServiceErr>;
}

pub struct GameService<T: IDatabase> {
    db: Arc<T>,
    rom_dir: String,
}

impl<T> GameService<T>
where
    T: IDatabase,
{
    pub async fn new(db: Arc<T>, rom_dir: String) -> anyhow::Result<Self> {
        let is_dir = metadata(&rom_dir)
            .await
            .map(|mdata| mdata.is_dir())
            .unwrap_or(false);
        if !is_dir {
            create_dir(&rom_dir).await?;
        }
        Ok(Self { db, rom_dir })
    }

    async fn write_rom(&self, id: Uuid, rom_bytes: &[u8]) -> Result<String, GameServiceErr> {
        let rom_path_abs = format!("{}/{}", self.rom_dir, id);
        write(&rom_path_abs, rom_bytes)
            .await
            .map_err(|e| GameServiceErr::Other(e.into()))?;
        let seq_path = rom_path_abs.split('/').rev().take(2).collect::<Vec<_>>();
        Ok(format!("{}/{}", seq_path[1], seq_path[0]))
    }
}

#[async_trait]
impl<T> IGameService for GameService<T>
where
    T: IDatabase + Send + Sync,
{
    async fn filter(
        &self,
        pagination: GamePaginationInternal,
    ) -> Result<Vec<GameFiltered>, GameServiceErr> {
        let mut query_builder: QueryBuilder<Postgres> = QueryBuilder::new("");
        let mut separated = query_builder.separated(" ");
        separated.push("select id, name, author_id, author_name, avatar_url, up_votes, down_votes from games where 1 = 1");

        if let Some(author_id) = pagination.author_id {
            separated.push("and author_id =");
            separated.push_bind(author_id);
        }

        if let Some(tag) = pagination.tag {
            separated.push("and");
            separated.push_bind(tag);
            separated.push("= any(tags)");
        }

        separated.push(format!(
            "order by {} {}",
            pagination.order_field, pagination.order_by
        ));

        separated.push("offset");
        separated.push_bind(pagination.offset);
        separated.push("limit");
        separated.push_bind(pagination.limit);

        query_builder
            .build_query_as::<GameFiltered>()
            .fetch_all(self.db.get_pool())
            .await
            .map_err(|e| GameServiceErr::Other(e.into()))
    }

    async fn get_by_id(&self, id: Uuid) -> Result<Option<Game>, GameServiceErr> {
        sqlx::query_as!(Game, "select * from games where id = $1", id)
            .fetch_optional(self.db.get_pool())
            .await
            .map_err(|e| GameServiceErr::Other(e.into()))
    }

    async fn add(
        &self,
        author_id: i64,
        author_name: String,
        game: AddGameRequest,
        rom_bytes: &[u8],
    ) -> Result<Game, GameServiceErr> {
        let mut tx = self
            .db
            .get_pool()
            .begin()
            .await
            .map_err(|e| GameServiceErr::Other(e.into()))?;

        let game = sqlx::query!(
            "insert into games
            (name, author_id, author_name, url, avatar_url, about, info, tags, rom) values
            ($1, $2, $3, $4, $5, $6, $7, $8, '')
            returning id",
            game.name,
            author_id,
            author_name,
            game.url,
            game.avatar_url,
            game.about,
            game.info,
            game.tags.as_deref(),
        )
        .fetch_one(&mut *tx)
        .await
        .map_err(|e| GameServiceErr::Other(e.into()))?;

        let rom_path = self.write_rom(game.id, rom_bytes).await?;

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
        sqlx::query!("delete from games where id = $1", id)
            .execute(self.db.get_pool())
            .await
            .map(|_| ())
            .map_err(|e| GameServiceErr::Other(e.into()))
    }

    async fn existed(&self, id: Uuid, author_id: i64) -> Result<bool, GameServiceErr> {
        sqlx::query!(
            "select count(*) as game_count from games where id = $1 and author_id = $2",
            id,
            author_id
        )
        .fetch_one(self.db.get_pool())
        .await
        .map(|result| result.game_count.map(|c| c > 0).unwrap_or(false))
        .map_err(|e| GameServiceErr::Other(e.into()))
    }
}
