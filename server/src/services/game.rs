use std::sync::Arc;

use async_trait::async_trait;
use sqlx::{Postgres, QueryBuilder};
use thiserror::Error;

use crate::{
    database::{entities::game::Game, IDatabase},
    model::requests::game::GameQuery,
};

#[derive(Error, Debug)]
pub enum GameServiceErr {
    #[error(transparent)]
    Other(#[from] anyhow::Error),
}

#[async_trait]
pub trait IGameService {
    async fn filter(&self, query: GameQuery) -> Result<Vec<Game>, GameServiceErr>;
    // async fn add(&self, game: AddGameRequest) -> Result<Game, GameServiceErr>;
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
    async fn filter(&self, query: GameQuery) -> Result<Vec<Game>, GameServiceErr> {
        let mut query_builder: QueryBuilder<Postgres> =
            QueryBuilder::new("select * from games where 1 = 1");

        if let Some(author_id) = query.author_id {
            query_builder.push(format!(" and author_id = {}", author_id));
        }

        if let Some(tag) = query.tag {
            query_builder.push(" and ");
            query_builder.push_bind(tag);
            query_builder.push(" = any(tags)");
        }

        if let Some(order_by) = query.order_by {
            if let Some(order_field) = query.order_field {
                query_builder.push(format!(" order by {} {}", order_field, order_by));
            }
        }

        if let Some(limit) = query.limit {
            query_builder.push(format!(" limit {}", limit));
        }

        match query_builder
            .build_query_as::<Game>()
            .fetch_all(self.db.get_pool())
            .await
        {
            Ok(games) => Ok(games),
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
