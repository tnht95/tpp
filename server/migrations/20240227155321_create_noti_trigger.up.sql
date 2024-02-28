-- Add up migration script here
CREATE FUNCTION notify_on_noti_insert ()
    RETURNS TRIGGER
    AS $$
DECLARE
    new_row RECORD;
BEGIN
    SELECT
        NEW.*,
        users.avatar AS by_user_name_avatar INTO new_row
    FROM
        users
    WHERE
        NEW.by_user_id = users.id;
    PERFORM
        pg_notify(format('to_user_id_%s', NEW.to_user_id), row_to_json(new_row)::text);
    RETURN NULL;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER noti_insert_trigger
    AFTER INSERT ON notis
    FOR EACH ROW
    EXECUTE FUNCTION notify_on_noti_insert ();

