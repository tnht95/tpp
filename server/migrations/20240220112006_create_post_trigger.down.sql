-- Add down migration script here
DROP TRIGGER post_insert_update_delete_trigger ON posts;

DROP FUNCTION insert_activity_on_post_insert_update_delete;

