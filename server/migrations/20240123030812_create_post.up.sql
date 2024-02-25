-- Add up migration script here
CREATE TABLE posts (
    id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
    user_id bigint REFERENCES users (id) ON DELETE CASCADE NOT NULL,
    content varchar(200) NOT NULL,
    likes bigint NOT NULL DEFAULT 0,
    comments bigint NOT NULL DEFAULT 0,
    created_at timestamp(6) with time zone DEFAULT now() NOT NULL,
    updated_at timestamp(6) with time zone DEFAULT now() NOT NULL
);

