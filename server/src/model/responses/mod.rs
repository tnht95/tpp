pub mod auth;
pub mod blog;
pub mod book;
pub mod comment;
pub mod discussion;
pub mod game;
pub mod post;
pub mod search;
pub mod subscribe;
pub mod user;

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
pub struct HttpResponseConstErr {
    pub code: &'static str,
    pub msg: &'static str,
}

pub const INTERNAL_SERVER_ERR: HttpResponseConstErr = HttpResponseConstErr {
    code: "ERR_000",
    msg: "Internal Server Error",
};

pub const UNAUTHORIZED_ERR: HttpResponseConstErr = HttpResponseConstErr {
    code: "ERR_001",
    msg: "Unauthorized",
};

pub const NOT_FOUND_ERR: HttpResponseConstErr = HttpResponseConstErr {
    code: "ERR_002",
    msg: "Not Found",
};

pub const FORBIDDEN_ERR: HttpResponseConstErr = HttpResponseConstErr {
    code: "ERR_003",
    msg: "Forbidden",
};

pub const INVALID_UUID_ERR: HttpResponseConstErr = HttpResponseConstErr {
    code: "ERR_100",
    msg: "Invalid Uuid",
};

pub const FIELD_MPART_ERR: HttpResponseConstErr = HttpResponseConstErr {
    code: "ERR_101",
    msg: "Failed to get multipart field",
};

pub const BYTES_MPART_ERR: HttpResponseConstErr = HttpResponseConstErr {
    code: "ERR_102",
    msg: "Failed to get multipart bytes",
};

pub const INVALID_USER_ID_ERR: HttpResponseConstErr = HttpResponseConstErr {
    code: "ERR_103",
    msg: "Invalid User ID",
};
