pub mod entities;
pub mod listener;

use std::time::Duration;

use anyhow::Result;
use async_trait::async_trait;
use log::LevelFilter;
use sqlx::{
    postgres::{PgConnectOptions, PgPoolOptions},
    ConnectOptions,
    Pool,
    Postgres,
};

use crate::config::Config;

#[async_trait]
pub trait IDatabase {
    fn get_pool(&self) -> &Pool<Postgres>;
    async fn is_healthy(&self) -> bool;
}

pub struct Database {
    pool: Pool<Postgres>,
}

impl Database {
    pub async fn new(config: &Config) -> Result<Self> {
        let opts = PgConnectOptions::from_url(&config.server.pg_url.parse()?)?
            .log_statements(LevelFilter::Info)
            .log_slow_statements(LevelFilter::Warn, Duration::from_millis(200));

        let pool = PgPoolOptions::new()
            .max_connections(config.server.pg_max_pool)
            .acquire_timeout(Duration::from_secs(1))
            .idle_timeout(Duration::from_secs(2))
            .max_lifetime(Duration::from_secs(3))
            .connect_with(opts)
            .await?;

        Ok(Database { pool })
    }

    pub async fn new_with_default_log(config: &Config) -> Result<Self> {
        let pool = PgPoolOptions::new()
            .max_connections(config.server.pg_max_pool)
            .acquire_timeout(Duration::from_secs(1))
            .idle_timeout(Duration::from_secs(2))
            .max_lifetime(Duration::from_secs(3))
            .connect(&config.server.pg_url)
            .await?;

        Ok(Database { pool })
    }

    pub async fn migrate(config: &Config) -> Result<()> {
        let pool = PgPoolOptions::new()
            .max_connections(1)
            .connect(&config.server.pg_url)
            .await?;
        Ok(sqlx::migrate!().run(&pool).await?)
    }
}

#[async_trait]
impl IDatabase for Database {
    fn get_pool(&self) -> &Pool<Postgres> {
        &self.pool
    }

    async fn is_healthy(&self) -> bool {
        sqlx::query("select 1").fetch_one(&self.pool).await.is_ok()
    }
}
