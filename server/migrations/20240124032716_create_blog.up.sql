-- Add up migration script here
create table blogs (
    id uuid default uuid_generate_v4() primary key,
    user_id bigint references users (id) on delete cascade not null,
    title varchar(200) not null,
    description varchar(200) not null,
    content varchar(2000) not null,
    comments bigint not null default 0,
    tags varchar(20) [],
    created_at timestamp (6) with time zone default now() not null,
    updated_at timestamp (6) with time zone default now() not null
);
