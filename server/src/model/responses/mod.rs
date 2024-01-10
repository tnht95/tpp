pub mod book;

use serde::Serialize;

#[derive(Serialize)]
pub struct HttpResponse<T> {
    pub data: T,
}
