-- Add up migration script here
create table user_subscribers (
    user_id bigint references users (id) on delete cascade not null,
    subscriber_id bigint references users (id) on delete cascade not null,
    created_at timestamp (6) with time zone default now() not null,
    updated_at timestamp (6) with time zone default now() not null,
    primary key (user_id, subscriber_id)
)
