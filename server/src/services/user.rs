use std::sync::Arc;

use async_trait::async_trait;
use thiserror::Error;

use crate::{
    database::{entities::user::User, IDatabase},
    model::responses::user::UserDetails,
};

#[derive(Error, Debug)]
pub enum UserServiceErr {
    #[error(transparent)]
    Other(#[from] anyhow::Error),
}

#[async_trait]
pub trait IUserService {
    async fn sync_user(&self, user: &User) -> Result<User, UserServiceErr>;
    async fn get_by_id(
        &self,
        user_id: i64,
        subscriber_id: Option<i64>,
    ) -> Result<Option<UserDetails>, UserServiceErr>;
    async fn get_id_by_name(&self, name: &str) -> Result<Option<i64>, UserServiceErr>;
}

pub struct UserService<T: IDatabase> {
    db: Arc<T>,
}

impl<T> UserService<T>
where
    T: IDatabase,
{
    pub fn new(db: Arc<T>) -> Self {
        Self { db }
    }
}

#[async_trait]
impl<T> IUserService for UserService<T>
where
    T: IDatabase + Send + Sync,
{
    async fn sync_user(&self, user: &User) -> Result<User, UserServiceErr> {
        sqlx::query_as!(
            User,
            "insert into users (id, name, avatar, github_url, bio)
            values ($1, $2, $3, $4, $5)
            on conflict (id) do update
            set name = $2, avatar = $3, github_url = $4, bio = $5, updated_at = now()
            returning *",
            user.id,
            user.name,
            user.avatar,
            user.github_url,
            user.bio,
        )
        .fetch_one(self.db.get_pool())
        .await
        .map_err(|e| UserServiceErr::Other(e.into()))
    }

    async fn get_by_id(
        &self,
        user_id: i64,
        subscriber_id: Option<i64>,
    ) -> Result<Option<UserDetails>, UserServiceErr> {
        sqlx::query_as!(
            UserDetails,
            r#"select
                u.*,
                count(s.user_id) as "subscribers!",
                case
                    when $1::bigint is not null then bool_or(s.subscriber_id is not null and s.subscriber_id = $1)
                    else null
                end as is_subscribed
            from
                users u
            left join
                user_subscribers s on u.id = s.user_id
            where
                u.id = $2
            group by
                u.id
            "#,
            subscriber_id,
            user_id
        )
        .fetch_optional(self.db.get_pool())
        .await
        .map_err(|e| UserServiceErr::Other(e.into()))
    }

    async fn get_id_by_name(&self, name: &str) -> Result<Option<i64>, UserServiceErr> {
        sqlx::query!("select id from users where name = $1", name)
            .fetch_optional(self.db.get_pool())
            .await
            .map(|u| u.map(|u| u.id))
            .map_err(|e| UserServiceErr::Other(e.into()))
    }
}

#[cfg(test)]
mod test {
    use std::sync::Arc;

    use sqlx::{Pool, Postgres};

    use crate::{
        database::Database,
        services::user::{IUserService, UserService},
    };

    #[sqlx::test]
    async fn get_id_by_username_not_found(pool: Pool<Postgres>) {
        let service: &dyn IUserService = &UserService::new(Arc::new(Database::new(pool.clone())));

        let user_id = service.get_id_by_name("some_name").await.unwrap();
        assert!(user_id.is_none())
    }

    #[sqlx::test]
    async fn get_id_by_username(pool: Pool<Postgres>) {
        let service: &dyn IUserService = &UserService::new(Arc::new(Database::new(pool.clone())));

        let user_id = service.get_id_by_name("tnht95").await.unwrap();

        assert_eq!(user_id, Some(40195902));
    }

    #[sqlx::test]
    async fn get_by_id_when_not_login(pool: Pool<Postgres>) {
        let service: &dyn IUserService = &UserService::new(Arc::new(Database::new(pool.clone())));

        let user = service.get_by_id(40195902, None).await.unwrap().unwrap();

        assert_eq!(user.name, "tnht95");
        assert!(user.is_subscribed.is_none());
    }
}
