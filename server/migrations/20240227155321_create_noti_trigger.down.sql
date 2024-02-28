-- Add down migration script here
DROP TRIGGER noti_insert_trigger ON notis;

DROP FUNCTION notify_on_noti_insert;

