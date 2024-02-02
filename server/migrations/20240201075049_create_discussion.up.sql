create table discussions (
    id uuid default uuid_generate_v4() primary key,
    user_id bigint references users (id) on delete cascade not null,
    user_name varchar(100) references users (name) on update cascade not null,
    game_id uuid references games (id) on delete cascade not null,
    title varchar(100) not null,
    content varchar(1000) not null,
    created_at timestamp (6) with time zone default now() not null,
    updated_at timestamp (6) with time zone default now() not null
);
