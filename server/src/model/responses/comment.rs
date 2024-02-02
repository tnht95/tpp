use crate::model::responses::HttpResponseConstErr;

pub const NOT_AUTH_DEL: HttpResponseConstErr = HttpResponseConstErr {
    code: "CMT_001",
    msg: "Not authorized to delete",
};

pub const NOT_AUTH_EDIT: HttpResponseConstErr = HttpResponseConstErr {
    code: "CMT_002",
    msg: "Not authorized to edit",
};
