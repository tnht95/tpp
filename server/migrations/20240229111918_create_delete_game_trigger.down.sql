-- Add down migration script here
DROP TRIGGER delete_game_trigger ON games;

DROP FUNCTION delete_noti_on_delete_game;

