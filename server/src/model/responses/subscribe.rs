use crate::model::responses::HttpResponseConstErr;

pub const SELF_SUBSCRIBE: HttpResponseConstErr = HttpResponseConstErr {
    code: "SUBSCRIBE_001",
    msg: "Self Subscribe Not Allowed",
};

pub const INVALID_USER: HttpResponseConstErr = HttpResponseConstErr {
    code: "SUBSCRIBE_002",
    msg: "Invalid User",
};
