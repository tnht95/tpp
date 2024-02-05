use serde::Serialize;

use super::{blog::BlogSummary, game::GameSummary, user::UserSummary};
use crate::database::entities::post::Post;

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SearchResult {
    pub games: Vec<GameSummary>,
    pub users: Vec<UserSummary>,
    pub posts: Vec<Post>,
    pub blogs: Vec<BlogSummary>,
}
