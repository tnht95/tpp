-- Add down migration script here
drop trigger post_insert_update_delete_trigger on posts;
drop function insert_activity_on_post_insert_update_delete;
