use anyhow::Result;
use async_trait::async_trait;
use redis::{aio::MultiplexedConnection, Client};

use crate::config::Config;

#[async_trait]
pub trait ICache {
    fn get_con(&self) -> MultiplexedConnection;
    fn get_exp(&self) -> u64;
    async fn ping(&self) -> Result<String>;
    async fn is_healthy(&self) -> Result<bool>;
}

pub struct Cache {
    con: MultiplexedConnection,
    exp_sec: u64,
}

impl Cache {
    pub async fn new(config: &Config) -> Result<Self> {
        Ok(Self {
            // redis://[<username>][:<password>@]<hostname>[:port][/<db>]
            con: Client::open(config.cache.redis_url.as_str())?
                .get_multiplexed_tokio_connection()
                .await?,
            exp_sec: config.cache.exp,
        })
    }
}

#[async_trait]
impl ICache for Cache {
    fn get_con(&self) -> MultiplexedConnection {
        self.con.clone()
    }

    fn get_exp(&self) -> u64 {
        self.exp_sec
    }

    async fn ping(&self) -> Result<String> {
        let mut con = self.get_con();
        Ok(redis::cmd("ping")
            .query_async::<_, String>(&mut con)
            .await?)
    }

    async fn is_healthy(&self) -> Result<bool> {
        let pong = self.ping().await?;
        Ok(pong.eq("PONG"))
    }
}
