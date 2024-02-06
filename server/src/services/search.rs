use std::sync::Arc;

use async_trait::async_trait;
use thiserror::Error;

use crate::{
    database::IDatabase,
    model::{
        requests::search::{Category, SearchPaginationInternal},
        responses::{
            blog::BlogFiltered,
            game::GameFiltered,
            post::PostDetails,
            search::SearchResult,
            user::UserSummary,
        },
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

    async fn search_games(
        &self,
        pagination: &SearchPaginationInternal,
    ) -> Result<Vec<GameFiltered>, SearchServiceErr> {
        if !pagination
            .category
            .as_ref()
            .map(|c| matches!(c, Category::Game))
            .unwrap_or(true)
        {
            return Ok(vec![]);
        }
        sqlx::query_as!(
            GameFiltered,
            "select id, name, author_id, author_name, avatar_url, up_votes, down_votes from games where name like $1 order by created_at desc offset $2 limit $3",
            pagination.keyword,
            pagination.offset,
            pagination.limit,
        )
        .fetch_all(self.db.get_pool())
        .await
        .map_err(|e| SearchServiceErr::Other(e.into()))
    }

    async fn search_users(
        &self,
        pagination: &SearchPaginationInternal,
    ) -> Result<Vec<UserSummary>, SearchServiceErr> {
        if !pagination
            .category
            .as_ref()
            .map(|c| matches!(c, Category::User))
            .unwrap_or(true)
        {
            return Ok(vec![]);
        }
        sqlx::query_as!(
            UserSummary,
            "select id, name, avatar from users where name like $1 order by created_at desc offset $2 limit $3",
            pagination.keyword,
            pagination.offset,
            pagination.limit,
        )
        .fetch_all(self.db.get_pool())
        .await
        .map_err(|e| SearchServiceErr::Other(e.into()))
    }

    async fn search_posts(
        &self,
        pagination: &SearchPaginationInternal,
    ) -> Result<Vec<PostDetails>, SearchServiceErr> {
        if !pagination
            .category
            .as_ref()
            .map(|c| matches!(c, Category::Post))
            .unwrap_or(true)
        {
            return Ok(vec![]);
        }
        sqlx::query_as!(
            PostDetails,
            "select
                posts.id,
                posts.author_id,
                users.name as author_name,
                users.avatar as author_avatar,
                posts.content,
                posts.likes,
                posts.comments,
                posts.created_at
            from posts
            left join users on users.id = posts.author_id
            where content like $1
            order by posts.created_at desc offset $2 limit $3",
            pagination.keyword,
            pagination.offset,
            pagination.limit
        )
        .fetch_all(self.db.get_pool())
        .await
        .map_err(|e| SearchServiceErr::Other(e.into()))
    }

    async fn search_blogs(
        &self,
        pagination: &SearchPaginationInternal,
    ) -> Result<Vec<BlogFiltered>, SearchServiceErr> {
        if !pagination
            .category
            .as_ref()
            .map(|c| matches!(c, Category::Blog))
            .unwrap_or(true)
        {
            return Ok(vec![]);
        }
        sqlx::query_as!(
            BlogFiltered,
            "select id, title, description, tags, created_at from blogs where title like $1 or description like $1 or content like $1 order by created_at desc offset $2 limit $3",
            pagination.keyword,
            pagination.offset,
            pagination.limit,
        )
        .fetch_all(self.db.get_pool())
        .await
        .map_err(|e| SearchServiceErr::Other(e.into()))
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
            games: self.search_games(&pagination).await?,
            users: self.search_users(&pagination).await?,
            posts: self.search_posts(&pagination).await?,
            blogs: self.search_blogs(&pagination).await?,
        })
    }
}
