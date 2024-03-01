-- Add down migration script here
DROP TRIGGER comment_insert_trigger ON comments;

DROP FUNCTION insert_noti_on_comment_insert;

DROP TRIGGER delete_comment_trigger ON comments;

DROP FUNCTION delete_data_on_delete_comment;

