CREATE TABLE discussions (
    id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
    user_id bigint REFERENCES users (id) ON DELETE CASCADE NOT NULL,
    user_name varchar(100) REFERENCES users (name) ON UPDATE CASCADE NOT NULL,
    game_id uuid REFERENCES games (id) ON DELETE CASCADE NOT NULL,
    likes bigint NOT NULL DEFAULT 0,
    comments bigint NOT NULL DEFAULT 0,
    title varchar(100) NOT NULL,
    content varchar(1000) NOT NULL,
    created_at timestamp(6) with time zone DEFAULT now() NOT NULL,
    updated_at timestamp(6) with time zone DEFAULT now() NOT NULL
);

