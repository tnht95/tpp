-- Add up migration script here
create table blogs (
    id uuid default uuid_generate_v4() primary key,
    title varchar(200) not null,
    description varchar(200) not null,
    content varchar(1000) not null,
    tags varchar(20) [],
    created_at timestamp (6) with time zone default now() not null,
    updated_at timestamp (6) with time zone default now() not null
);
