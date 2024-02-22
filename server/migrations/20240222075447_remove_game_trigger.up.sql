-- Add down migration script here
drop trigger game_insert_trigger on games;
drop function insert_activity_on_game_insert;
