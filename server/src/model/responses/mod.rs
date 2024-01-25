pub mod auth;
pub mod book;

use serde::Serialize;

#[derive(Serialize)]
pub struct HttpResponse<T> {
    pub data: T,
}

#[derive(Serialize)]
pub struct HttpResponseErr {
    pub code: String,
    pub msg: String,
}

#[derive(Serialize)]
pub struct ConstantErr {
    pub code: &'static str,
    pub msg: &'static str,
}

pub const INTERNAL_SERVER_ERR: ConstantErr = ConstantErr {
    code: "ERR_000",
    msg: "Internal Server Error",
};
