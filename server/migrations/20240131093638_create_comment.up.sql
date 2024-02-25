-- Add up migration script here
CREATE TYPE comment_type AS enum (
    'discussions',
    'blogs',
    'posts'
);

CREATE TABLE comments (
    id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
    user_id bigint REFERENCES users (id) ON DELETE CASCADE NOT NULL,
    user_name varchar(100) REFERENCES users (name) ON UPDATE CASCADE NOT NULL,
    target_id uuid NOT NULL,
    content varchar(200) NOT NULL,
    target_type comment_type NOT NULL,
    likes bigint NOT NULL DEFAULT 0,
    created_at timestamp(6) with time zone DEFAULT now() NOT NULL,
    updated_at timestamp(6) with time zone DEFAULT now() NOT NULL
);

