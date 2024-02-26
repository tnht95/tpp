-- Add down migration script here
DROP TRIGGER activity_insert_trigger ON activities;

DROP FUNCTION insert_noti_on_activity_insert;

