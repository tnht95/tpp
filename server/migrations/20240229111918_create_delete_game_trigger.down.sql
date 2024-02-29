-- Add down migration script here
DROP TRIGGER delete_game_trigger ON games;

DROP FUNCTION delete_data_on_delete_game;

