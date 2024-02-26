-- Add down migration script here
DROP TRIGGER user_subscribers_insert_trigger ON user_subscribers;

DROP FUNCTION insert_noti_on_user_subscribers_insert;

