-- Add up migration script here
CREATE TABLE user_subscribers (
    user_id bigint REFERENCES users (id) ON DELETE CASCADE NOT NULL,
    subscriber_id bigint REFERENCES users (id) ON DELETE CASCADE NOT NULL,
    created_at timestamp(6) with time zone DEFAULT now() NOT NULL,
    updated_at timestamp(6) with time zone DEFAULT now() NOT NULL,
    PRIMARY KEY (user_id, subscriber_id))
