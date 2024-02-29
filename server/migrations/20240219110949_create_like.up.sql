CREATE TYPE like_type AS enum (
    'discussions',
    'comments',
    'posts'
);

CREATE TABLE likes (
    id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
    user_id bigint REFERENCES users (id) ON DELETE CASCADE NOT NULL,
    target_id uuid NOT NULL,
    target_type like_type NOT NULL,
    created_at timestamp(6) with time zone DEFAULT now() NOT NULL,
    UNIQUE (user_id, target_id)
);

