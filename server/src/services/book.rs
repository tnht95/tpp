use std::sync::Arc;

use async_trait::async_trait;
use thiserror::Error;

use crate::{
    database::{entities::book::Book, IDatabase},
    model::requests::book::AddBookRequest,
};

#[derive(Error, Debug)]
pub enum BookServiceErr {
    #[error(transparent)]
    Other(#[from] anyhow::Error),
}

#[async_trait]
pub trait IBookService {
    async fn get_all(&self) -> Result<Vec<Book>, BookServiceErr>;
    async fn add(&self, book: AddBookRequest) -> Result<Book, BookServiceErr>;
}

pub struct BookService<T: IDatabase> {
    db: Arc<T>,
}

impl<T> BookService<T>
where
    T: IDatabase,
{
    pub fn new(db: Arc<T>) -> Self {
        Self { db }
    }
}

#[async_trait]
impl<T> IBookService for BookService<T>
where
    T: IDatabase + Send + Sync,
{
    async fn get_all(&self) -> Result<Vec<Book>, BookServiceErr> {
        sqlx::query_as!(Book, "select * from books")
            .fetch_all(self.db.get_pool())
            .await
            .map_err(|e| BookServiceErr::Other(e.into()))
    }

    async fn add(&self, book: AddBookRequest) -> Result<Book, BookServiceErr> {
        sqlx::query_as!(
            Book,
            r#"
                insert into books ("name", "author", "description") values($1, $2, $3)
                returning *
            "#,
            book.name,
            book.author,
            book.description,
        )
        .fetch_one(self.db.get_pool())
        .await
        .map_err(|e| BookServiceErr::Other(e.into()))
    }
}
