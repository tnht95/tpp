use axum::{
    extract::{Path, Query, State},
    response::{IntoResponse, Response},
    Json,
};

use super::InternalState;
use crate::{
    http::utils::{
        auth::AuthenticationMaybe,
        err_handler::response_unhandled_err,
        validator::QueryValidator,
    },
    model::{
        requests::search::{SearchPagination, TagSearchPagination},
        responses::HttpResponse,
    },
    services::{
        search::{ISearchService, SearchServiceErr},
        IInternalServices,
    },
};

pub async fn search<TInternalServices: IInternalServices>(
    QueryValidator(pagination): QueryValidator<SearchPagination>,
    State(state): InternalState<TInternalServices>,
    AuthenticationMaybe { user, .. }: AuthenticationMaybe<TInternalServices>,
) -> Response {
    match state
        .services
        .search
        .search(pagination.into(), user.map(|u| u.id))
        .await
    {
        Ok(result) => Json(HttpResponse { data: result }).into_response(),
        Err(SearchServiceErr::Other(e)) => response_unhandled_err(e),
    }
}

pub async fn tag_search<TInternalServices: IInternalServices>(
    Path(tag): Path<String>,
    Query(pagination): Query<TagSearchPagination>,
    State(state): InternalState<TInternalServices>,
) -> Response {
    match state
        .services
        .search
        .tag_search(pagination.into(), tag)
        .await
    {
        Ok(result) => Json(HttpResponse { data: result }).into_response(),
        Err(SearchServiceErr::Other(e)) => response_unhandled_err(e),
    }
}
