use std::sync::Arc;

use async_trait::async_trait;
use thiserror::Error;
use uuid::Uuid;

use crate::{
    database::IDatabase,
    model::{
        requests::{
            post::{AddPostRequest, EditPostRequest},
            PaginationInternal,
        },
        responses::post::PostDetails,
    },
};

#[derive(Error, Debug)]
pub enum PostServiceErr {
    #[error(transparent)]
    Other(#[from] anyhow::Error),
}

#[async_trait]
pub trait IPostService {
    async fn filter(
        &self,
        pagination: PaginationInternal,
        user_id: Option<i64>,
    ) -> Result<Vec<PostDetails>, PostServiceErr>;
    async fn get_by_id(
        &self,
        id: Uuid,
        user_id: Option<i64>,
    ) -> Result<Option<PostDetails>, PostServiceErr>;
    async fn add(&self, author_id: i64, post: AddPostRequest) -> Result<(), PostServiceErr>;
    async fn delete(&self, id: Uuid) -> Result<(), PostServiceErr>;
    async fn existed(&self, id: Uuid, author_id: i64) -> Result<bool, PostServiceErr>;
    async fn edit(
        &self,
        id: Uuid,
        post: EditPostRequest,
        user_id: i64,
    ) -> Result<PostDetails, PostServiceErr>;
}

pub struct PostService<T: IDatabase> {
    db: Arc<T>,
}

impl<T> PostService<T>
where
    T: IDatabase,
{
    pub fn new(db: Arc<T>) -> Self {
        Self { db }
    }
}

#[async_trait]
impl<T> IPostService for PostService<T>
where
    T: IDatabase + Send + Sync,
{
    async fn filter(
        &self,
        pagination: PaginationInternal,
        user_id: Option<i64>,
    ) -> Result<Vec<PostDetails>, PostServiceErr> {
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
                    when $1::bigint is not null then exists (
                        select 1
                        from likes
                        where target_id = posts.id and user_id = $1
                    )
                    else null
                end as is_liked
            from
                posts
                left join users on users.id = posts.user_id
            order by
                posts.created_at desc
            offset $2 limit $3;",
            user_id,
            pagination.offset,
            pagination.limit,
        )
        .fetch_all(self.db.get_pool())
        .await
        .map_err(|e| PostServiceErr::Other(e.into()))
    }

    async fn get_by_id(
        &self,
        id: Uuid,
        user_id: Option<i64>,
    ) -> Result<Option<PostDetails>, PostServiceErr> {
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
                    when $1::bigint is not null then exists (
                        select 1
                        from likes
                        where target_id = posts.id and user_id = $1
                    )
                    else null
                end as is_liked
            from posts
            left join users on users.id = posts.user_id
            where posts.id = $2",
            user_id,
            id
        )
        .fetch_optional(self.db.get_pool())
        .await
        .map_err(|e| PostServiceErr::Other(e.into()))
    }

    async fn add(&self, author_id: i64, post: AddPostRequest) -> Result<(), PostServiceErr> {
        sqlx::query!(
            "insert into posts (user_id, content) values ($1, $2)",
            author_id,
            post.content
        )
        .execute(self.db.get_pool())
        .await
        .map(|_| ())
        .map_err(|e| PostServiceErr::Other(e.into()))
    }

    async fn delete(&self, id: Uuid) -> Result<(), PostServiceErr> {
        sqlx::query!("delete from posts where id = $1", id)
            .execute(self.db.get_pool())
            .await
            .map(|_| ())
            .map_err(|e| PostServiceErr::Other(e.into()))
    }

    async fn existed(&self, id: Uuid, author_id: i64) -> Result<bool, PostServiceErr> {
        sqlx::query!(
            "select count(*) as post_count from posts where id = $1 and user_id = $2",
            id,
            author_id
        )
        .fetch_one(self.db.get_pool())
        .await
        .map(|result| result.post_count.map(|c| c > 0).unwrap_or(false))
        .map_err(|e| PostServiceErr::Other(e.into()))
    }

    async fn edit(
        &self,
        id: Uuid,
        post: EditPostRequest,
        user_id: i64,
    ) -> Result<PostDetails, PostServiceErr> {
        sqlx::query!(
            "update posts set content = $1, updated_at = now() where id = $2",
            post.content,
            id,
        )
        .execute(self.db.get_pool())
        .await
        .map_err(|e| PostServiceErr::Other(e.into()))?;
        self.get_by_id(id, Some(user_id))
            .await
            .map(|p| p.unwrap_or_default())
    }
}

#[cfg(test)]
mod tests {
    use std::sync::Arc;

    use sqlx::{Pool, Postgres};

    use crate::{
        database::Database,
        model::requests::post::{AddPostRequest, EditPostRequest},
        services::post::{IPostService, PostService},
    };

    #[sqlx::test]
    async fn add_post(pool: Pool<Postgres>) {
        let service: &dyn IPostService = &PostService::new(Arc::new(Database::new(pool.clone())));

        service
            .add(
                40195902,
                AddPostRequest {
                    content: "new".to_string(),
                },
            )
            .await
            .unwrap();

        let post = sqlx::query!(
            "select * from posts where user_id = 40195902 order by created_at desc limit 1"
        )
        .fetch_one(&pool)
        .await
        .unwrap();

        assert_eq!(post.content, "new");
    }

    #[sqlx::test]
    async fn edit_post(pool: Pool<Postgres>) {
        let service: &dyn IPostService = &PostService::new(Arc::new(Database::new(pool.clone())));

        sqlx::query!(
            "INSERT INTO posts (id, user_id, content)
                      VALUES ('f9e866b0-042d-4b6f-83b3-cb8683f37cd1', 40195902, 'Post Content');"
        )
        .execute(&pool)
        .await
        .unwrap();

        let post = service
            .edit(
                "f9e866b0-042d-4b6f-83b3-cb8683f37cd1".parse().unwrap(),
                EditPostRequest {
                    content: "new".to_string(),
                },
                40195902,
            )
            .await
            .unwrap();

        assert_eq!(post.content, "new");
    }
    #[sqlx::test]
    async fn delete_post(pool: Pool<Postgres>) {
        let service: &dyn IPostService = &PostService::new(Arc::new(Database::new(pool.clone())));

        sqlx::query!(
            "INSERT INTO posts (id, user_id, content)
                      VALUES ('f9e866b0-042d-4b6f-83b3-cb8683f37cd1', 40195902, 'Post Content');"
        )
        .execute(&pool)
        .await
        .unwrap();

        let res = sqlx::query!(
            "select 1 as res from posts where id = 'f9e866b0-042d-4b6f-83b3-cb8683f37cd1'"
        )
        .fetch_optional(&pool)
        .await
        .unwrap();

        assert!(res.is_some());

        service
            .delete("f9e866b0-042d-4b6f-83b3-cb8683f37cd1".parse().unwrap())
            .await
            .unwrap();

        let res = sqlx::query!(
            "select 1 as res from posts where id = 'f9e866b0-042d-4b6f-83b3-cb8683f37cd1'"
        )
        .fetch_optional(&pool)
        .await
        .unwrap();

        assert!(res.is_none());
    }
    #[sqlx::test]
    async fn get_post_by_id_not_found(pool: Pool<Postgres>) {
        let service: &dyn IPostService = &PostService::new(Arc::new(Database::new(pool.clone())));

        let post = service
            .get_by_id(
                "f9e866b0-042d-4b6f-83b3-cb8683f37cd1".parse().unwrap(),
                None,
            )
            .await
            .unwrap();

        assert!(post.is_none())
    }

    #[sqlx::test]
    async fn get_post_by_id(pool: Pool<Postgres>) {
        let service: &dyn IPostService = &PostService::new(Arc::new(Database::new(pool.clone())));

        sqlx::query!(
            "INSERT INTO posts (id, user_id, content)
                      VALUES ('f9e866b0-042d-4b6f-83b3-cb8683f37cd1', 40195902, 'Post Content');"
        )
        .execute(&pool)
        .await
        .unwrap();

        let post = service
            .get_by_id(
                "f9e866b0-042d-4b6f-83b3-cb8683f37cd1".parse().unwrap(),
                None,
            )
            .await
            .unwrap();
        assert!(post.is_some());
        assert!(post.unwrap().is_liked.is_none());

        let post = service
            .get_by_id(
                "f9e866b0-042d-4b6f-83b3-cb8683f37cd1".parse().unwrap(),
                None,
            )
            .await
            .unwrap();
        assert!(post.is_some());
        assert!(post.unwrap().is_liked.is_none());

        let post = service
            .get_by_id(
                "f9e866b0-042d-4b6f-83b3-cb8683f37cd1".parse().unwrap(),
                Some(40195902),
            )
            .await
            .unwrap();
        assert!(post.is_some());
        assert_eq!(post.unwrap().is_liked, Some(false));
    }
    #[sqlx::test]
    async fn existed_post(pool: Pool<Postgres>) {
        let service: &dyn IPostService = &PostService::new(Arc::new(Database::new(pool.clone())));

        sqlx::query!(
            "INSERT INTO posts (id, user_id, content)
                      VALUES ('f9e866b0-042d-4b6f-83b3-cb8683f37cd1', 40195902, 'Post Content');"
        )
        .execute(&pool)
        .await
        .unwrap();

        let res = service
            .existed(
                "f9e866b0-042d-4b6f-83b3-cb8683f37cd1".parse().unwrap(),
                40195902,
            )
            .await
            .unwrap();
        assert!(res);
    }
}
