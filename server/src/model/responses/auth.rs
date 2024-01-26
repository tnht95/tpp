use super::HttpResponseConstErr;

pub const MISSING_OATH_CODE: HttpResponseConstErr = HttpResponseConstErr {
    code: "AUTH_001",
    msg: "Missing oauth code",
};

pub const INVALID_OATH_CODE: HttpResponseConstErr = HttpResponseConstErr {
    code: "AUTH_002",
    msg: "Invalid oauth code",
};
