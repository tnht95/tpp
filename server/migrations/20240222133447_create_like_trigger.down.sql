-- Add down migration script here
DROP TRIGGER like_insert_trigger ON likes;

DROP FUNCTION insert_noti_on_like_insert;

