-- Add up migration script here
create type activity_type as enum ('game', 'post');

create table activities (
    user_id bigint not null,
    target_type activity_type not null,
    target_id uuid not null,
    memo varchar(300) not null,
    created_at timestamp (6) with time zone default now() not null
);

create index on activities (target_id);
