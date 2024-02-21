-- Add up migration script here
drop trigger game_insert_update_trigger on games;
drop function insert_activity_on_game_insert_update;
