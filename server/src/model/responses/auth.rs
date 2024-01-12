use serde::Serialize;

use super::ConstantErr;

pub const MISSING_OATH_CODE: ConstantErr = ConstantErr {
    code: "AUTH_001",
    msg: "Missing oauth code",
};

pub const INVALID_OATH_CODE: ConstantErr = ConstantErr {
    code: "AUTH_002",
    msg: "Invalid oauth code",
};

#[derive(Serialize)]
pub struct Auth {
    pub access_token: String,
}
