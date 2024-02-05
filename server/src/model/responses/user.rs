use serde::Serialize;

use crate::model::responses::HttpResponseConstErr;

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct UserSummary {
    pub id: i64,
    pub name: String,
    pub avatar: String,
}

pub const NOT_FOUND: HttpResponseConstErr = HttpResponseConstErr {
    code: "USER_001",
    msg: "User Not Found",
};
