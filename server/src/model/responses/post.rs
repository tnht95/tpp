use crate::model::responses::HttpResponseConstErr;

pub const NOT_AUTH_DEL: HttpResponseConstErr = HttpResponseConstErr {
    code: "POST_001",
    msg: "Not authorized to delete",
};

pub const NOT_AUTH_EDIT: HttpResponseConstErr = HttpResponseConstErr {
    code: "POST_002",
    msg: "Not authorized to edit",
};
