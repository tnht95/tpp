use axum::extract::{Path, Query, State};
use axum::Json;
use axum::response::{IntoResponse, Response};
use crate::http::controllers::InternalState;
use crate::http::utils::err_handler::response_unhandled_err;
use crate::model::responses::HttpResponse;
use crate::services::IInternalServices;
use crate::services::user::{IUserService, UserServiceErr};

pub async fn get_by_id<TInternalServices: IInternalServices>(
    Path(id): Path<i64>,
    State(state): InternalState<TInternalServices>,
) -> Response {
    match state.services.user.get_by_id(id).await {
        Ok(user) => Json(HttpResponse { data: user }).into_response(),
        Err(UserServiceErr::Other(e)) => response_unhandled_err(e),
    }
}