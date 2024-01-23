-- Add up migration script here
create table books
(
    id serial primary key,
    name varchar(255) not null,
    author varchar(255) not null,
    description varchar(5000) not null,
    version int not null default 0,
    created_by varchar(255) not null default 'system',
    created_at timestamp (6) with time zone default now() not null,
    updated_by varchar(255) not null default 'system',
    updated_at timestamp (6) with time zone default now() not null
);
