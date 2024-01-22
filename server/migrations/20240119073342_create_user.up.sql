-- Add up migration script here
create table users
(
    id         bigint primary key                        not null,
    name       varchar(100)                              not null,
    github_url text                                      not null,
    avatar     text                                      not null,
    bio        text,
    created_at timestamp(6) with time zone default now() not null,
    updated_at timestamp(6) with time zone default now() not null
);