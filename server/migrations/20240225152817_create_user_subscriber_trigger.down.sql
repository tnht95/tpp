-- Add down migration script here
DROP TRIGGER user_subscriber_insert_trigger ON user_subscribers;

DROP FUNCTION insert_noti_on_user_subscriber_insert;

