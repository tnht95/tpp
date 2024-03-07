#![allow(dead_code)]

use std::{path::PathBuf, sync::Arc};

use axum::Router;
use redis::AsyncCommands;
use server::{
    cache::{Cache, ICache},
    config::Config,
    database::{
        entities::{blog::Blog, discussion::Discussion, game::Game, post::Post, user::User},
        Database,
        IDatabase,
    },
    init,
    utils::{jwt, time::now},
};
use sqlx::postgres::PgPoolOptions;
use tokio::sync::OnceCell;
use uuid::Uuid;

static CONFIG_INSTANCE: OnceCell<Config> = OnceCell::const_new();
static DB_INSTANCE: OnceCell<Database> = OnceCell::const_new();

pub async fn get_config() -> &'static Config {
    CONFIG_INSTANCE
        .get_or_init(|| async { Config::from_file(PathBuf::from("./config.toml")).unwrap() })
        .await
}

pub async fn get_db() -> &'static Database {
    DB_INSTANCE
        .get_or_init(|| async { Database::new(get_config().await).await.unwrap() })
        .await
}

async fn clean_data() {
    let config = get_config().await;
    let pool = PgPoolOptions::new()
        .max_connections(1)
        .connect(&config.server.pg_url)
        .await
        .unwrap();
    sqlx::migrate!().undo(&pool, 0).await.unwrap()
}

pub async fn setup_app(reset_data: bool) -> Router {
    if reset_data {
        clean_data().await;
    }
    Arc::new(init(get_config().await.clone()).await.unwrap()).build_app()
}

pub async fn get_admin() -> User {
    User {
        id: 40195902,
        name: "tnht95".to_string(),
        github_url: "".to_string(),
        bio: None,
        avatar: "".to_string(),
        created_at: Default::default(),
        updated_at: Default::default(),
    }
}

pub async fn mock_user(id: i64, name: &str, persist_db: bool) -> User {
    let user = User {
        id,
        name: name.into(),
        github_url: format!("https://github.com/{name}"),
        bio: None,
        avatar: format!("https://avatars.githubusercontent.com/u/{id}?v=4"),
        created_at: now(),
        updated_at: now(),
    };
    if persist_db {
        sqlx::query!(
            "insert into users (id, name, avatar, github_url)
            values ($1, $2, $3, $4)
            on conflict do nothing",
            user.id,
            user.name,
            user.avatar,
            user.github_url,
        )
        .execute(get_db().await.get_pool())
        .await
        .unwrap();
    }
    user
}

pub async fn mock_discussion(game_id: Uuid) -> Discussion {
    let disc = Discussion {
        id: Uuid::new_v4(),
        user_id: 40195902,
        user_name: "tnht95".to_string(),
        game_id,
        title: "abc".to_string(),
        content: "cba".to_string(),
        created_at: Default::default(),
        updated_at: Default::default(),
    };
    sqlx::query!(
            "INSERT INTO discussions (id, user_id, user_name, game_id, title, content, created_at, updated_at)
             VALUES ($1,$2,$3, $4, $5, $6, $7, $8)
             on conflict do nothing;
            ",
            disc.id,
            disc.user_id,
            disc.user_name,
            disc.game_id,
            disc.title,
            disc.content,
            disc.created_at,
            disc.updated_at
        )
        .execute(get_db().await.get_pool())
        .await
        .unwrap();

    disc
}

pub async fn mock_game() -> Game {
    let game = Game {
        id: Uuid::new_v4(),
        name: "game".to_string(),
        author_id: 40195902,
        author_name: "tnht95".to_string(),
        url: None,
        avatar_url: None,
        about: None,
        info: None,
        up_votes: 0,
        down_votes: 0,
        tags: None,
        rom: "".to_string(),
        created_at: Default::default(),
        updated_at: Default::default(),
    };

    sqlx::query!(
        r#"
        INSERT INTO games (id, name, author_id, author_name, rom, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        "#,
        game.id,
        game.name,
        game.author_id,
        game.author_name,
        game.rom,
        game.created_at,
        game.updated_at
    )
    .execute(get_db().await.get_pool())
    .await
    .unwrap();

    game
}

pub async fn mock_blog() -> Blog {
    let blog = Blog {
        id: Uuid::new_v4(),
        user_id: 40195902,
        title: "abc".to_string(),
        description: "abc".to_string(),
        content: "abc".to_string(),
        comments: 0,
        tags: None,
        created_at: Default::default(),
        updated_at: Default::default(),
    };

    sqlx::query!(
        r#"
        INSERT INTO blogs (id, user_id, title, description, content, comments, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        "#,
        blog.id,
        blog.user_id,
        blog.title,
        blog.description,
        blog.content,
        blog.comments,
        blog.created_at,
        blog.updated_at
    )
        .execute(get_db().await.get_pool())
        .await
        .unwrap();

    blog
}

pub async fn mock_post() -> Post {
    let post = Post {
        id: Uuid::new_v4(),
        user_id: 40195902,
        content: "abc".to_string(),
        likes: 0,
        comments: 0,
        created_at: Default::default(),
        updated_at: Default::default(),
    };

    sqlx::query!(
        r#"
        INSERT INTO posts (id, user_id, content,created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5)
        "#,
        post.id,
        post.user_id,
        post.content,
        post.created_at,
        post.updated_at
    )
    .execute(get_db().await.get_pool())
    .await
    .unwrap();

    post
}

pub async fn gen_jwt(user: User) -> String {
    jwt::encode(user, get_config().await).unwrap()
}

pub async fn gen_ws_ticket(user: &User, persist_cache: bool) -> String {
    let ws_ticket = Uuid::new_v4().to_string();
    let user_str = serde_json::to_string(user).unwrap();
    if persist_cache {
        let cache = Cache::new(get_config().await).await.unwrap();
        let mut con = cache.get_con();
        let _: () = con
            .set_ex(format!("ws_ticket_{ws_ticket}"), user_str, cache.get_exp())
            .await
            .unwrap();
    }
    ws_ticket
}
