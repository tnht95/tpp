-- Add up migration script here
CREATE FUNCTION insert_delete_noti_on_discussion_insert_delete ()
    RETURNS TRIGGER
    AS $$
DECLARE
    noti_to_user_id bigint;
BEGIN
    IF (TG_OP = 'INSERT') THEN
        SELECT
            author_id INTO noti_to_user_id
        FROM
            games
        WHERE
            id = NEW.game_id;
        IF (noti_to_user_id != NEW.user_id) THEN
            INSERT INTO notis (to_user_id, by_user_id, by_user_name, by_object_id, target_type, target_id, parent_target_id)
                VALUES (noti_to_user_id, NEW.user_id, NEW.user_name, NEW.id, 'game_discussion', NEW.id, NEW.game_id);
        END IF;
    ELSIF (TG_OP = 'DELETE') THEN
        DELETE FROM notis
        WHERE target_id = OLD.id;
        DELETE FROM comments
        WHERE target_id = OLD.id;
        DELETE FROM likes
        WHERE target_id = OLD.id;
    END IF;
    RETURN NULL;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER discussion_insert_delete_trigger
    AFTER INSERT OR DELETE ON discussions
    FOR EACH ROW
    EXECUTE FUNCTION insert_delete_noti_on_discussion_insert_delete ();

