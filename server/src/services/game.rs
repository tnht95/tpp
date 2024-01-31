use std::sync::Arc;

use async_trait::async_trait;
use sqlx::{Postgres, QueryBuilder};
use thiserror::Error;
use uuid::Uuid;

use crate::{
    database::{
        entities::game::{Game, GameSummary},
        IDatabase,
    },
    model::requests::game::GameQuery,
};

#[derive(Error, Debug)]
pub enum GameServiceErr {
    #[error(transparent)]
    Other(#[from] anyhow::Error),
}

#[async_trait]
pub trait IGameService {
    async fn filter(&self, query: GameQuery) -> Result<Vec<GameSummary>, GameServiceErr>;
    // async fn add(&self, game: AddGameRequest) -> Result<Game, GameServiceErr>;
    async fn get_by_id(&self, id: Uuid) -> Result<Option<Game>, GameServiceErr>;
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
            separated.push(offset);
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

    // async fn add(&self, game: AddGameRequest) -> Result<Game, GameServiceErr> {
    //     match sqlx::query_as!(
    //         Game,
    //         "insert into posts(name, author_id, author_name, url, avatar_url, ) values($1, $2) returning *",
    //         author_id,
    //         post.content
    //     )
    //         .fetch_one(self.db.get_pool())
    //         .await
    //     {
    //         Ok(posts) => Ok(posts),
    //         Err(e) => Err(PostServiceErr::Other(e.into())),
    //     }
    // }
}
