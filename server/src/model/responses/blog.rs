use crate::model::responses::HttpResponseConstErr;

pub const NOT_FOUND: HttpResponseConstErr = HttpResponseConstErr {
    code: "BLOG_001",
    msg: "Blog Not Found",
};
