-- Add up migration script here
create table games
(
    id uuid default uuid_generate_v4() primary key,
    name varchar(40) not null,
    author_name varchar(100) references users (name) on update cascade not null,
    author_id bigint references users (id) on delete cascade not null,
    url varchar(255),
    avatar_url varchar(255),
    about varchar(255),
    info varchar(2000),
    stars smallint not null default 0,
    tags varchar(20) [],
    rom varchar(1000) not null,
    created_at timestamp (6) with time zone default now() not null,
    updated_at timestamp (6) with time zone default now() not null
);
