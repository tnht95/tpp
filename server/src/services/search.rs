use std::sync::Arc;

use async_trait::async_trait;
use thiserror::Error;

use crate::{
    database::IDatabase,
    model::{
        requests::search::SearchPaginationInternal,
        responses::{game::GameSummary, search::SearchResult},
    },
};

#[derive(Error, Debug)]
pub enum SearchServiceErr {
    #[error(transparent)]
    Other(#[from] anyhow::Error),
}

#[async_trait]
pub trait ISearchService {
    async fn search(
        &self,
        pagination: SearchPaginationInternal,
    ) -> Result<SearchResult, SearchServiceErr>;
}

pub struct SearchService<T: IDatabase> {
    db: Arc<T>,
}

impl<T> SearchService<T>
where
    T: IDatabase,
{
    pub fn new(db: Arc<T>) -> Self {
        Self { db }
    }

    async fn search_game(
        &self,
        pagination: &SearchPaginationInternal,
    ) -> Result<Vec<GameSummary>, SearchServiceErr> {
        sqlx::query_as!(
            GameSummary,
            "select id, name, author_id, author_name, avatar_url, up_votes, down_votes from games where name like $1 order by created_at desc offset $2 limit $3",
            pagination.keyword,
            pagination.offset,
            pagination.limit,
        )
        .fetch_all(self.db.get_pool())
        .await
        .map_err(|e|SearchServiceErr::Other(e.into()))
    }
}

#[async_trait]
impl<T> ISearchService for SearchService<T>
where
    T: IDatabase + Send + Sync,
{
    async fn search(
        &self,
        pagination: SearchPaginationInternal,
    ) -> Result<SearchResult, SearchServiceErr> {
        Ok(SearchResult {
            game: self.search_game(&pagination).await?,
        })
    }
}
