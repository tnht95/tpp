pub mod entities;

use std::time::Duration;

use anyhow::Result;
use log::LevelFilter;
use sqlx::{
    postgres::{PgConnectOptions, PgPoolOptions},
    ConnectOptions,
    Pool,
    Postgres,
};

use crate::config::Config;

pub trait IDatabase {
    fn get_pool(&self) -> &Pool<Postgres>;
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
            .connect_with(opts)
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

impl IDatabase for Database {
    fn get_pool(&self) -> &Pool<Postgres> {
        &self.pool
    }
}
