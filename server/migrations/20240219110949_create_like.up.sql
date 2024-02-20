create type like_target_types as enum ('discussions', 'comments', 'posts');

create table likes
(
    user_id bigint references users (id) on delete cascade not null,
    target_id uuid not null,
    target_type like_target_types not null,
    created_at timestamp (6) with time zone default now() not null,
    updated_at timestamp (6) with time zone default now() not null,
    primary key (user_id, target_id)
);
