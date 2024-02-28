-- Add down migration script here
DROP TRIGGER discussion_insert_trigger ON discussions;

DROP FUNCTION insert_noti_on_discussion_insert;

