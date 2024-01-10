use anyhow::Result;
use async_trait::async_trait;

use crate::{
    database::{entities::books::Book, IDatabase},
    model::requests::book::AddBookRequest,
};

#[async_trait]
pub trait IBookService {
    async fn get_books(&self) -> Result<Vec<Book>>;
    async fn add_books(&self, book: AddBookRequest) -> Result<Book>;
}

pub struct BookService<T: IDatabase> {
    db: T,
}

impl<T> BookService<T>
where
    T: IDatabase,
{
    pub fn new(db: T) -> Self {
        Self { db }
    }
}

#[async_trait]
impl<T> IBookService for BookService<T>
where
    T: IDatabase + Send + Sync,
{
    async fn get_books(&self) -> Result<Vec<Book>> {
        let books = sqlx::query_as!(Book, "select * from books")
            .fetch_all(self.db.get_pool())
            .await?;
        Ok(books)
    }

    async fn add_books(&self, book: AddBookRequest) -> Result<Book> {
        let book = sqlx::query_as!(
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
        .await?;
        Ok(book)
    }
}
