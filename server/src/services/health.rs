use std::sync::Arc;

use async_trait::async_trait;

use crate::database::IDatabase;

#[async_trait]
pub trait IHealthService {
    async fn is_healthy(&self) -> bool;
    fn app_close(&mut self);
}

pub struct HealthService<T: IDatabase> {
    db: Arc<T>,
    is_app_closed: bool,
}

impl<T> HealthService<T>
where
    T: IDatabase,
{
    pub fn new(db: Arc<T>) -> Self {
        Self {
            db,
            is_app_closed: false,
        }
    }
}

#[async_trait]
impl<T> IHealthService for HealthService<T>
where
    T: IDatabase + Send + Sync,
{
    async fn is_healthy(&self) -> bool {
        !self.is_app_closed && self.db.is_healthy().await
    }

    fn app_close(&mut self) {
        self.is_app_closed = true;
    }
}
