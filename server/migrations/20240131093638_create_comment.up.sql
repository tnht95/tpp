-- Add up migration script here
create type comment_type as enum ('discussion', 'blog', 'post');

create table comments
(
    id uuid default uuid_generate_v4() primary key,
    user_id bigint references users (id) on delete cascade not null,
    user_name varchar(100) references users (name) on update cascade not null,
    target_id uuid not null,
    content varchar(200) not null,
    target_type comment_type not null,
    likes bigint not null default 0,
    created_at timestamp (6) with time zone default now() not null,
    updated_at timestamp (6) with time zone default now() not null
);
