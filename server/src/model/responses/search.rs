use serde::Serialize;

use super::{blog::BlogSummary, game::GameSummary, post::PostDetails, user::UserSummary};

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SearchResult {
    pub games: Vec<GameSummary>,
    pub users: Vec<UserSummary>,
    pub posts: Vec<PostDetails>,
    pub blogs: Vec<BlogSummary>,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct TagSearchResult {
    pub games: Vec<GameSummary>,
    pub blogs: Vec<BlogSummary>,
}
