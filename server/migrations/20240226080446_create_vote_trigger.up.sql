-- Add up migration script here
-- Trigger function to insert into the activities table when a new vote is inserted or updated
CREATE FUNCTION insert_noti_on_vote_insert_update ()
    RETURNS TRIGGER
    AS $$
DECLARE
    noti_by_user_name varchar(100);
    noti_to_user_id bigint;
BEGIN
    IF NOT NEW.is_up THEN
        RETURN NULL;
    END IF;
    -- get user_name
    SELECT
        name INTO noti_by_user_name
    FROM
        users
    WHERE
        id = NEW.user_id;
    SELECT
        author_id INTO noti_to_user_id
    FROM
        games
    WHERE
        id = NEW.game_id;
    -- prevent noti to oneself
    IF (noti_to_user_id != NEW.user_id) THEN
        INSERT INTO notis (to_user_id, by_user_id, by_user_name, by_object_id, target_type, target_id, parent_target_id)
            VALUES (noti_to_user_id, NEW.user_id, noti_by_user_name, uuid_nil (), 'vote_game', NEW.game_id, NULL)
        ON CONFLICT (to_user_id, by_user_id, by_object_id, target_type, target_id)
            DO NOTHING;
    END IF;
    RETURN NULL;
END;
$$
LANGUAGE plpgsql;

-- Create a trigger that inserts a record into the notis table when a new vote is inserted or updated
CREATE TRIGGER vote_insert_update_trigger
    AFTER INSERT OR UPDATE ON votes
    FOR EACH ROW
    EXECUTE FUNCTION insert_noti_on_vote_insert_update ();

