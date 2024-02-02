use crate::model::responses::HttpResponseConstErr;

pub const NOT_FOUND: HttpResponseConstErr = HttpResponseConstErr {
    code: "USER_001",
    msg: "User Not Found",
};
