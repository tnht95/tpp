pub mod entities;

use anyhow::Result;
use sqlx::{postgres::PgPoolOptions, Pool, Postgres};

use crate::config::Config;

pub trait IDatabase {
    fn get_pool(&self) -> &Pool<Postgres>;
}

pub struct Database {
    pool: Pool<Postgres>,
}

impl Database {
    pub async fn new(config: &Config) -> Result<Self> {
        let pool = PgPoolOptions::new()
            .max_connections(config.server.pg_max_pool)
            .connect(&config.server.pg_url)
            .await?;

        Ok(Database { pool })
    }
}

impl IDatabase for Database {
    fn get_pool(&self) -> &Pool<Postgres> {
        &self.pool
    }
}
