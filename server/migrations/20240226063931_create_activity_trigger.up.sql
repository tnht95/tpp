-- Add up migration script here
-- Trigger function to insert into the notis table when a new activity is inserted
CREATE FUNCTION insert_noti_on_activity_insert ()
    RETURNS TRIGGER
    AS $$
DECLARE
    noti_by_user_name varchar(100);
    noti_target_type varchar(100);
BEGIN
    -- get user_name
    SELECT
        name INTO noti_by_user_name
    FROM
        users
    WHERE
        id = NEW.user_id;
    IF (NEW.target_type = 'added_game') THEN
        SELECT
            'user_added_game' INTO noti_target_type;
    ELSIF (NEW.target_type = 'updated_game') THEN
        SELECT
            'user_updated_game' INTO noti_target_type;
    ELSIF (NEW.target_type = 'post') THEN
        SELECT
            'user_post' INTO noti_target_type;
    END IF;
    INSERT INTO notis (to_user_id, by_user_id, by_user_name, target_type, target_id, parent_target_id)
    SELECT
        user_subscribers.subscriber_id,
        NEW.user_id,
        noti_by_user_name,
        noti_target_type::noti_type,
        NEW.target_id,
        NULL
    FROM
        user_subscribers
    WHERE
        user_id = NEW.user_id;
    RETURN NULL;
END;
$$
LANGUAGE plpgsql;

-- Create a trigger that inserts a record into the notis table when a new activity is inserted
CREATE TRIGGER activity_insert_trigger
    AFTER INSERT ON activities
    FOR EACH ROW
    EXECUTE FUNCTION insert_noti_on_activity_insert ();

