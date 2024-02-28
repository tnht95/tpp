-- Add up migration script here
-- Trigger function to insert into the notis table when a new discussion is inserted
CREATE FUNCTION insert_noti_on_discussion_insert ()
    RETURNS TRIGGER
    AS $$
DECLARE
    noti_to_user_id bigint;
BEGIN
    SELECT
        author_id INTO noti_to_user_id
    FROM
        games
    WHERE
        id = NEW.game_id;
    INSERT INTO notis (to_user_id, by_user_id, by_user_name, by_object_id, target_type, target_id, parent_target_id)
        VALUES (noti_to_user_id, NEW.user_id, NEW.user_name, NEW.id, 'game_discussion', NEW.id, NEW.game_id);
    RETURN NULL;
END;
$$
LANGUAGE plpgsql;

-- Create a trigger that inserts a record into the notis table when a new discussion is inserted
CREATE TRIGGER discussion_insert_trigger
    AFTER INSERT ON discussions
    FOR EACH ROW
    EXECUTE FUNCTION insert_noti_on_discussion_insert ();

