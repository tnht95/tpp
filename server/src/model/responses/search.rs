use serde::Serialize;

use super::{blog::BlogFiltered, game::GameFiltered, user::UserSummary};
use crate::database::entities::post::Post;

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SearchResult {
    pub games: Vec<GameFiltered>,
    pub users: Vec<UserSummary>,
    pub posts: Vec<Post>,
    pub blogs: Vec<BlogFiltered>,
}
