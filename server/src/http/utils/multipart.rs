use axum::{body::Bytes, extract::Multipart, response::Response};

use super::err_handler::response_400_with_const;
use crate::model::responses::{BYTES_MPART_ERR, FIELD_MPART_ERR};

pub async fn extract_bytes_from_multipart(multipart: &mut Multipart) -> Result<Bytes, Response> {
    if let Ok(Some(field)) = multipart.next_field().await {
        return field
            .bytes()
            .await
            .map_err(|_| response_400_with_const(BYTES_MPART_ERR));
    };
    Err(response_400_with_const(FIELD_MPART_ERR))
}
