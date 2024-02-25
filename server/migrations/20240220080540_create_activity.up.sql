-- Add up migration script here
CREATE TYPE activity_type AS enum (
    'user',
    'added_game',
    'updated_game',
    'post'
);

CREATE TABLE activities (
    user_id bigint NOT NULL,
    target_type activity_type NOT NULL,
    target_id uuid NOT NULL,
    memo varchar(350) NOT NULL,
    created_at timestamp(6) with time zone DEFAULT now() NOT NULL
);

CREATE INDEX ON activities (user_id);

CREATE INDEX ON activities (target_id);

