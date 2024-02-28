-- Add up migration script here
CREATE TYPE noti_type AS enum (
    'like_post',
    'like_discussion',
    'like_comment_blog',
    'like_comment_post',
    'like_comment_discussion',
    'comment_blog',
    'comment_post',
    'comment_discussion',
    'comment_tag_blog',
    'comment_tag_post',
    'comment_tag_discussion',
    'game_discussion',
    'subscribe',
    'user_added_game',
    'user_updated_game',
    'user_post',
    'vote_game'
);

CREATE TABLE notis (
    id bigserial PRIMARY KEY,
    to_user_id bigint REFERENCES users (id) ON DELETE CASCADE NOT NULL,
    by_user_id bigint REFERENCES users (id) ON DELETE CASCADE NOT NULL,
    by_user_name varchar(100) REFERENCES users (name) ON UPDATE CASCADE NOT NULL,
    by_object_id uuid NOT NULL, -- caused by
    target_type noti_type NOT NULL,
    target_id uuid NOT NULL,
    parent_target_id uuid,
    is_read boolean NOT NULL DEFAULT FALSE,
    created_at timestamp(6) with time zone DEFAULT now() NOT NULL,
    UNIQUE (to_user_id, by_user_id, by_object_id, target_type, target_id) -- noti once only
)
