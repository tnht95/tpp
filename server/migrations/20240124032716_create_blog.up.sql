-- Add up migration script here
CREATE TABLE blogs (
    id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
    user_id bigint REFERENCES users (id) ON DELETE CASCADE NOT NULL,
    title varchar(200) NOT NULL,
    description varchar(200) NOT NULL,
    content varchar(2000) NOT NULL,
    comments bigint NOT NULL DEFAULT 0,
    tags varchar(20)[],
    created_at timestamp(6) with time zone DEFAULT now() NOT NULL,
    updated_at timestamp(6) with time zone DEFAULT now() NOT NULL
);

