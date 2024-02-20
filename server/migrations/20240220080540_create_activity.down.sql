-- Add down migration script here
create type activity_type as enum ('games', 'users', 'posts');

create table activities (
    user_id bigint not null,
    target_type activity_type not null,
    target_id uuid not null,
    memo varchar(200) not null,
    created_at timestamp (6) with time zone default now() not null
)
