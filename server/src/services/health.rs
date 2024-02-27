use std::sync::Arc;

use async_trait::async_trait;

use crate::{cache::ICache, database::IDatabase};

#[async_trait]
pub trait IHealthService {
    async fn is_healthy(&self) -> bool;
    fn app_close(&mut self);
}

pub struct HealthService<TDb: IDatabase, TCache: ICache> {
    db: TDb,
    cache: Arc<TCache>,
    is_app_closed: bool,
}

impl<TDb, TCache> HealthService<TDb, TCache>
where
    TDb: IDatabase,
    TCache: ICache,
{
    pub fn new(db: TDb, cache: Arc<TCache>) -> Self {
        Self {
            db,
            cache,
            is_app_closed: false,
        }
    }
}

#[async_trait]
impl<TDb, TCache> IHealthService for HealthService<TDb, TCache>
where
    TDb: IDatabase + Sync,
    TCache: ICache + Sync + Send,
{
    async fn is_healthy(&self) -> bool {
        !self.is_app_closed
            && self.cache.is_healthy().await.unwrap_or(false)
            && self.db.is_healthy().await
    }

    fn app_close(&mut self) {
        self.is_app_closed = true;
    }
}
