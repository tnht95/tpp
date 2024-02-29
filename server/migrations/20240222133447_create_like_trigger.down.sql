-- Add down migration script here
DROP TRIGGER like_insert_trigger ON likes;

DROP FUNCTION insert_noti_on_like_insert;

DROP TRIGGER like_delete_trigger ON likes;

DROP FUNCTION delete_noti_on_like_delete;

