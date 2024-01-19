-- Add up migration script here
create table users
(
    id          bigint primary key,
    name        varchar(100),
    github_url  text,
    avatar      text,
    bio text,
    created_at timestamp (6) with time zone default now() not null,
    updated_at timestamp (6) with time zone default now() not null
);