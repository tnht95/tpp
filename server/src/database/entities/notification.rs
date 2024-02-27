use serde::Serialize;

#[derive(Serialize, sqlx::Type)]
#[serde(rename_all = "camelCase")]
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
    Subscribe,
    UserAddedGame,
    UserUpdatedGame,
    UserPost,
    VoteGame,
}
