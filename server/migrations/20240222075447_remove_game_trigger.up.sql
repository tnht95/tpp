-- Add down migration script here
DROP TRIGGER game_insert_trigger ON games;

DROP FUNCTION insert_activity_on_game_insert;

