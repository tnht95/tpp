-- Add up migration script here
-- Trigger function to insert into the notis table when a new user_subscribers is inserted
CREATE FUNCTION insert_noti_on_user_subscriber_insert ()
    RETURNS TRIGGER
    AS $$
DECLARE
    noti_by_user_name varchar(100);
BEGIN
    -- get user_name
    SELECT
        name INTO noti_by_user_name
    FROM
        users
    WHERE
        id = NEW.subscriber_id;
    INSERT INTO notis (to_user_id, by_user_id, by_user_name, by_object_id, target_type, target_id, parent_target_id)
        VALUES (NEW.user_id, NEW.subscriber_id, noti_by_user_name, uuid_nil (), 'subscribe', uuid_nil (), NULL)
    ON CONFLICT (to_user_id, by_user_id, by_object_id, target_type, target_id)
        DO NOTHING;
    RETURN NULL;
END;
$$
LANGUAGE plpgsql;

-- Create a trigger that inserts a record into the notis table when a new user_subscribers is inserted
CREATE TRIGGER user_subscriber_insert_trigger
    AFTER INSERT ON user_subscribers
    FOR EACH ROW
    EXECUTE FUNCTION insert_noti_on_user_subscriber_insert ();

