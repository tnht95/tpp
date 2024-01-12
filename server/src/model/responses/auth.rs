use super::ConstantErr;

pub const MISSING_INSTALLATION_ID: ConstantErr = ConstantErr {
    code: "AUTH_001",
    msg: "Missing installation id",
};

pub const BAD_FORMAT_INSTALLATION_ID: ConstantErr = ConstantErr {
    code: "AUTH_002",
    msg: "Bad format installation id",
};

pub const INVALID_INSTALLATION_ID: ConstantErr = ConstantErr {
    code: "AUTH_003",
    msg: "Invalid installation id",
};
