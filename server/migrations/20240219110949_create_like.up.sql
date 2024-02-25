CREATE TYPE like_type AS enum (
    'discussions',
    'comments',
    'posts'
);

CREATE TABLE likes (
    user_id bigint REFERENCES users (id) ON DELETE CASCADE NOT NULL,
    target_id uuid NOT NULL,
    target_type like_type NOT NULL,
    created_at timestamp(6) with time zone DEFAULT now() NOT NULL,
    PRIMARY KEY (user_id, target_id)
);

