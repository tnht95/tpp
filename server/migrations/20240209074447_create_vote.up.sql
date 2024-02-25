-- Add up migration script here
CREATE TABLE votes (
    user_id bigint REFERENCES users (id) ON DELETE CASCADE NOT NULL,
    game_id uuid REFERENCES games (id) ON DELETE CASCADE NOT NULL,
    is_up boolean NOT NULL,
    created_at timestamp(6) with time zone DEFAULT now() NOT NULL,
    updated_at timestamp(6) with time zone DEFAULT now() NOT NULL,
    PRIMARY KEY (user_id, game_id))
