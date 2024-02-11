use crate::model::responses::HttpResponseConstErr;

pub const INVALID_GAME: HttpResponseConstErr = HttpResponseConstErr {
    code: "VOTE_001",
    msg: "Invalid Game",
};
