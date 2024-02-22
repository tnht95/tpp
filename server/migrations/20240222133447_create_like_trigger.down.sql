-- Add down migration script here
drop trigger like_insert_trigger on likes;
drop function insert_noti_on_like_insert;
