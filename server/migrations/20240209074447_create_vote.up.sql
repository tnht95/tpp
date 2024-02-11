-- Add up migration script here
create table votes (
    user_id bigint references users (id) on delete cascade not null,
    game_id uuid references games (id) on delete cascade not null,
    is_up boolean not null,
    created_at timestamp (6) with time zone default now() not null,
    updated_at timestamp (6) with time zone default now() not null,
    primary key (user_id, game_id)
)
