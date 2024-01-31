use axum::{
    extract::{Query, State},
    response::{IntoResponse, Response},
    Json,
};

use crate::{
    http::{controllers::InternalState, utils::err_handler::response_unhandled_err},
    model::{requests::comment::CommentQuery, responses::HttpResponse},
    services::{
        comment::{CommentServiceErr, ICommentService},
        IInternalServices,
    },
};

pub async fn filter<TInternalServices: IInternalServices>(
    State(state): InternalState<TInternalServices>,
    Query(query): Query<CommentQuery>,
) -> Response {
    match state.services.comment.filter(query).await {
        Ok(comments) => Json(HttpResponse { data: comments }).into_response(),
        Err(CommentServiceErr::Other(e)) => response_unhandled_err(e),
    }
}
