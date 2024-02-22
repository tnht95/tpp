-- Add down migration script here
drop trigger user_insert_trigger on users;
drop function insert_activity_on_user_insert;
