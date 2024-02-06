use serde::Serialize;

use super::{blog::BlogSummary, game::GameFiltered, post::PostDetails, user::UserSummary};

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SearchResult {
    pub games: Vec<GameFiltered>,
    pub users: Vec<UserSummary>,
    pub posts: Vec<PostDetails>,
    pub blogs: Vec<BlogSummary>,
}
