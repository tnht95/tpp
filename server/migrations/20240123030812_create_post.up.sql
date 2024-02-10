-- Add up migration script here
create table posts (
    id uuid default uuid_generate_v4() primary key,
    author_id bigint references users (id) on delete cascade not null,
    content varchar(200) not null,
    likes bigint not null default 0,
    comments bigint not null default 0,
    created_at timestamp (6) with time zone default now() not null,
    updated_at timestamp (6) with time zone default now() not null
);
