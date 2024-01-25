use axum::{
    extract::{Path, State},
    response::{IntoResponse, Response},
    Json,
};

use crate::{
    database::entities::user::User,
    http::{controllers::InternalState, utils::err_handler::response_unhandled_err},
    model::responses::HttpResponse,
    services::{
        user::{IUserService, UserServiceErr},
        IInternalServices,
    },
};

pub async fn get_by_id<TInternalServices: IInternalServices>(
    Path(id): Path<String>,
    State(state): InternalState<TInternalServices>,
) -> Response {
    let id = match id.parse::<i64>() {
        Ok(id) => id,
        Err(_) => return Json(HttpResponse { data: None::<User> }).into_response(),
    };

    match state.services.user.get_by_id(id).await {
        Ok(user) => Json(HttpResponse { data: user }).into_response(),
        Err(UserServiceErr::Other(e)) => response_unhandled_err(e),
    }
}
