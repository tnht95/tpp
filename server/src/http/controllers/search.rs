use axum::{
    extract::State,
    response::{IntoResponse, Response},
    Json,
};

use super::InternalState;
use crate::{
    http::utils::{err_handler::response_unhandled_err, validator::QueryValidator},
    model::{requests::search::SearchPagination, responses::HttpResponse},
    services::{
        search::{ISearchService, SearchServiceErr},
        IInternalServices,
    },
};

pub async fn search<TInternalServices: IInternalServices>(
    QueryValidator(pagination): QueryValidator<SearchPagination>,
    State(state): InternalState<TInternalServices>,
) -> Response {
    match state.services.search.search(pagination.into()).await {
        Ok(result) => Json(HttpResponse { data: result }).into_response(),
        Err(SearchServiceErr::Other(e)) => response_unhandled_err(e),
    }
}
