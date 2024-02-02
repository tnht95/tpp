use crate::model::responses::HttpResponseConstErr;

pub const NOT_AUTH_DEL: HttpResponseConstErr = HttpResponseConstErr {
    code: "GAME_001",
    msg: "Not authorized to delete",
};

pub const NOT_FOUND: HttpResponseConstErr = HttpResponseConstErr {
    code: "GAME_002",
    msg: "Game Not Found",
};

pub const DESERIALIZE_GAME_ERR: HttpResponseConstErr = HttpResponseConstErr {
    code: "GAME_003",
    msg: "Failed to deserialize game from bytes",
};