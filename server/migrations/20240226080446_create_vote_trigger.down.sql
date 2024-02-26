-- Add down migration script here
DROP TRIGGER vote_insert_update_trigger ON votes;

DROP FUNCTION insert_noti_on_vote_insert_update;

