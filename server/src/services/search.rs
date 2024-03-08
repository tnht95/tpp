use std::sync::Arc;

use async_trait::async_trait;
use thiserror::Error;
use tokio::sync::oneshot;

use crate::{
    database::IDatabase,
    model::{
        requests::search::{
            Category,
            SearchPaginationInternal,
            TagCategory,
            TagSearchPaginationInternal,
        },
        responses::{
            blog::BlogSummary,
            game::GameSummary,
            post::PostDetails,
            search::{SearchResult, TagSearchResult},
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
        user_id: Option<i64>,
    ) -> Result<SearchResult, SearchServiceErr>;

    async fn tag_search(
        &self,
        pagination: TagSearchPaginationInternal,
        tag: String,
    ) -> Result<TagSearchResult, SearchServiceErr>;
}

pub struct SearchService<T: IDatabase> {
    db: Arc<T>,
}

impl<T> SearchService<T>
where
    T: IDatabase + Send + Sync + 'static,
{
    pub fn new(db: Arc<T>) -> Self {
        Self { db }
    }

    fn search_games_task(
        &self,
        pagination: Arc<SearchPaginationInternal>,
        tx: oneshot::Sender<Result<Vec<GameSummary>, SearchServiceErr>>,
    ) {
        if !pagination
            .category
            .as_ref()
            .map(|c| matches!(c, Category::Games))
            .unwrap_or(true)
        {
            let _ = tx.send(Ok(vec![]));
            return;
        }
        let db = Arc::clone(&self.db);
        tokio::spawn(async move {
            let _ = tx.send(
                sqlx::query_as!(
                    GameSummary,
                    "select id, name, author_id, author_name, avatar_url, up_votes, down_votes
                    from games
                    where name ilike $1
                    order by created_at desc offset $2 limit $3",
                    format!("%{}%", pagination.keyword),
                    pagination.offset,
                    pagination.limit,
                )
                .fetch_all(db.get_pool())
                .await
                .map_err(|e| SearchServiceErr::Other(e.into())),
            );
        });
    }

    fn search_users_task(
        &self,
        pagination: Arc<SearchPaginationInternal>,
        tx: oneshot::Sender<Result<Vec<UserSummary>, SearchServiceErr>>,
    ) {
        if !pagination
            .category
            .as_ref()
            .map(|c| matches!(c, Category::Users))
            .unwrap_or(true)
        {
            let _ = tx.send(Ok(vec![]));
            return;
        }
        let db = Arc::clone(&self.db);
        tokio::spawn(async move {
            let _ = tx.send(
                sqlx::query_as!(
                    UserSummary,
                    "select id, name, avatar
                    from users
                    where name ilike $1
                    order by created_at desc offset $2 limit $3",
                    format!("%{}%", pagination.keyword),
                    pagination.offset,
                    pagination.limit,
                )
                .fetch_all(db.get_pool())
                .await
                .map_err(|e| SearchServiceErr::Other(e.into())),
            );
        });
    }

    fn search_posts_task(
        &self,
        pagination: Arc<SearchPaginationInternal>,
        tx: oneshot::Sender<Result<Vec<PostDetails>, SearchServiceErr>>,
        user_id: Option<i64>,
    ) {
        if !pagination
            .category
            .as_ref()
            .map(|c| matches!(c, Category::Posts))
            .unwrap_or(true)
        {
            let _ = tx.send(Ok(vec![]));
            return;
        }
        let db = Arc::clone(&self.db);
        tokio::spawn(async move {
            let _ = tx.send(
                sqlx::query_as!(
                    PostDetails,
                    "select
                    posts.id,
                    posts.user_id,
                    users.name as user_name,
                    users.avatar as user_avatar,
                    posts.content,
                    posts.likes,
                    posts.comments,
                    posts.created_at,
                    case
                        when $4::bigint is not null then exists (
                            select 1
                            from likes
                            where target_id = posts.id and user_id = $4
                        )
                        else null
                    end as is_liked
                    from posts
                    left join users on users.id = posts.user_id
                    where content ilike $1
                    order by posts.created_at desc offset $2 limit $3",
                    format!("%{}%", pagination.keyword),
                    pagination.offset,
                    pagination.limit,
                    user_id
                )
                .fetch_all(db.get_pool())
                .await
                .map_err(|e| SearchServiceErr::Other(e.into())),
            );
        });
    }

    fn search_blogs_task(
        &self,
        pagination: Arc<SearchPaginationInternal>,
        tx: oneshot::Sender<Result<Vec<BlogSummary>, SearchServiceErr>>,
    ) {
        if !pagination
            .category
            .as_ref()
            .map(|c| matches!(c, Category::Blogs))
            .unwrap_or(true)
        {
            let _ = tx.send(Ok(vec![]));
            return;
        }
        let db = Arc::clone(&self.db);
        tokio::spawn(async move {
            let _ = tx.send(
                sqlx::query_as!(
                    BlogSummary,
                    "select
                        id, title, description, tags, created_at
                    from blogs
                    where
                        title ilike $1 or
                        description ilike $1 or
                        content ilike $1
                    order by created_at desc offset $2 limit $3",
                    format!("%{}%", pagination.keyword),
                    pagination.offset,
                    pagination.limit,
                )
                .fetch_all(db.get_pool())
                .await
                .map_err(|e| SearchServiceErr::Other(e.into())),
            );
        });
    }

    fn search_blogs_by_tag(
        &self,
        tag: Arc<String>,
        pagination: Arc<TagSearchPaginationInternal>,
        tx: oneshot::Sender<Result<Vec<BlogSummary>, SearchServiceErr>>,
    ) {
        if !pagination
            .category
            .as_ref()
            .map(|c| matches!(c, TagCategory::Blogs))
            .unwrap_or(true)
        {
            let _ = tx.send(Ok(vec![]));
            return;
        }

        let db = Arc::clone(&self.db);
        tokio::spawn(async move {
            let _ = tx.send(
                sqlx::query_as!(
                    BlogSummary,
                    "select
                        id, title, description, tags, created_at
                    from blogs
                    where
                        $1 ilike any(tags)
                    order by created_at desc offset $2 limit $3",
                    format!("{}", tag),
                    pagination.offset,
                    pagination.limit,
                )
                .fetch_all(db.get_pool())
                .await
                .map_err(|e| SearchServiceErr::Other(e.into())),
            );
        });
    }

    fn search_games_by_tag(
        &self,
        tag: Arc<String>,
        pagination: Arc<TagSearchPaginationInternal>,
        tx: oneshot::Sender<Result<Vec<GameSummary>, SearchServiceErr>>,
    ) {
        if !pagination
            .category
            .as_ref()
            .map(|c| matches!(c, TagCategory::Games))
            .unwrap_or(true)
        {
            let _ = tx.send(Ok(vec![]));
            return;
        }

        let db = Arc::clone(&self.db);
        tokio::spawn(async move {
            let _ = tx.send(
                sqlx::query_as!(
                    GameSummary,
                    "select id, name, author_id, author_name, avatar_url, up_votes, down_votes
                    from games
                    where $1 ilike any(tags)
                    order by created_at desc offset $2 limit $3",
                    format!("{}", tag),
                    pagination.offset,
                    pagination.limit,
                )
                .fetch_all(db.get_pool())
                .await
                .map_err(|e| SearchServiceErr::Other(e.into())),
            );
        });
    }
}

#[async_trait]
impl<T> ISearchService for SearchService<T>
where
    T: IDatabase + Send + Sync + 'static,
{
    async fn search(
        &self,
        pagination: SearchPaginationInternal,
        user_id: Option<i64>,
    ) -> Result<SearchResult, SearchServiceErr> {
        let pagination_ref = Arc::new(pagination);

        let (game_tx, game_rx) = oneshot::channel();
        self.search_games_task(Arc::clone(&pagination_ref), game_tx);

        let (user_tx, user_rx) = oneshot::channel();
        self.search_users_task(Arc::clone(&pagination_ref), user_tx);

        let (post_tx, post_rx) = oneshot::channel();
        self.search_posts_task(Arc::clone(&pagination_ref), post_tx, user_id);

        let (blog_tx, blog_rx) = oneshot::channel();
        self.search_blogs_task(pagination_ref, blog_tx);

        Ok(SearchResult {
            games: game_rx
                .await
                .unwrap_or_else(|e| Err(SearchServiceErr::Other(e.into())))?,
            users: user_rx
                .await
                .unwrap_or_else(|e| Err(SearchServiceErr::Other(e.into())))?,
            posts: post_rx
                .await
                .unwrap_or_else(|e| Err(SearchServiceErr::Other(e.into())))?,
            blogs: blog_rx
                .await
                .unwrap_or_else(|e| Err(SearchServiceErr::Other(e.into())))?,
        })
    }

    async fn tag_search(
        &self,
        pagination: TagSearchPaginationInternal,
        tag: String,
    ) -> Result<TagSearchResult, SearchServiceErr> {
        let pagination_ref = Arc::new(pagination);
        let tag_ref = Arc::new(tag);

        let (game_tx, game_rx) = oneshot::channel();
        self.search_games_by_tag(Arc::clone(&tag_ref), Arc::clone(&pagination_ref), game_tx);

        let (blog_tx, blog_rx) = oneshot::channel();
        self.search_blogs_by_tag(tag_ref, pagination_ref, blog_tx);

        Ok(TagSearchResult {
            games: game_rx
                .await
                .unwrap_or_else(|e| Err(SearchServiceErr::Other(e.into())))?,

            blogs: blog_rx
                .await
                .unwrap_or_else(|e| Err(SearchServiceErr::Other(e.into())))?,
        })
    }
}
