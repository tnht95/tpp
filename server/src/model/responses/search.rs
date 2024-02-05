use serde::Serialize;

use super::game::GameSummary;

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SearchResult {
    pub game: Vec<GameSummary>,
}
