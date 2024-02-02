use crate::model::responses::HttpResponseConstErr;

pub const NOT_AUTH_DEL: HttpResponseConstErr = HttpResponseConstErr {
    code: "GAME_001",
    msg: "Not authorized to delete",
};
