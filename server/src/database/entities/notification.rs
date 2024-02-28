use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, sqlx::Type)]
#[serde(rename_all(serialize = "camelCase", deserialize = "snake_case"))]
#[sqlx(type_name = "noti_type", rename_all = "snake_case")]
pub enum NotificationType {
    LikePost,
    LikeDiscussion,
    LikeCommentBlog,
    LikeCommentPost,
    LikeCommentDiscussion,
    CommentBlog,
    CommentPost,
    CommentDiscussion,
    CommentTagBlog,
    CommentTagPost,
    CommentTagDiscussion,
    GameDiscussion,
    Subscribe,
    UserAddedGame,
    UserUpdatedGame,
    UserPost,
    VoteGame,
}
