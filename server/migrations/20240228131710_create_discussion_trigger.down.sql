-- Add down migration script here
DROP TRIGGER discussion_insert_delete_trigger ON discussions;

DROP FUNCTION insert_delete_noti_on_discussion_insert_delete;

