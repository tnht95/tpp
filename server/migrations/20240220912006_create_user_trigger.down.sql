-- Add down migration script here
DROP TRIGGER user_insert_trigger ON users;

DROP FUNCTION insert_activity_on_user_insert;

