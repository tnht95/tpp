-- Add up migration script here
create type noti_type as enum (
    'like_post', 'like_discussion',
    'like_comment_blog', 'like_comment_post', 'like_comment_discussion',
    'comment_blog', 'comment_post', 'comment_discussion',
    'comment_tag_blog', 'comment_tag_post', 'comment_tag_discussion'
    'subscribe',
    'user_added_game', 'user_updated_game', 'user_post',
    'vote_game'
);

create table notis (
    id uuid default uuid_generate_v4() primary key,
    to_user_id bigint references users (id) on delete cascade not null,
    by_user_id bigint references users (id) on delete cascade not null,
    by_user_name varchar(100) references users (name) on update cascade not null,
    target_type noti_type not null,
    target_id uuid not null,
    parent_target_id uuid,
    is_read boolean not null default false,
    created_at timestamp (6) with time zone default now() not null
)
