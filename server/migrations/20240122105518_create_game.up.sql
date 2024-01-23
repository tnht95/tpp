-- Add up migration script here
create table games
(
    id         uuid                        DEFAULT uuid_generate_v4() PRIMARY KEY,
    name       varchar(40)                                    not null,
    author_id  bigint REFERENCES users (id) ON DELETE CASCADE not null,
    github_url varchar(1000)                                  not null,
    avatar_url varchar(1000)               DEFAULT 'https://jacopofarina.eu/static/img/chip_8_screenshot.png',
    about      varchar(255),
    info       varchar(1000),
    stars      smallint                                       not null,
    tags       varchar(100),
    rom        varchar(1000)                                  not null,
    created_at timestamp(6) with time zone default now()      not null,
    updated_at timestamp(6) with time zone default now()      not null
);