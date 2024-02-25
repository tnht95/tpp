-- Add up migration script here
-- Trigger function to insert into the activities table when a new post is inserted, updated or deleted
CREATE FUNCTION insert_activity_on_post_insert_update_delete ()
    RETURNS TRIGGER
    AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO activities (user_id, target_type, target_id, memo)
            VALUES (NEW.user_id, 'post', NEW.id, 'Content: ' || NEW.content);
    ELSIF (TG_OP = 'UPDATE') THEN
        UPDATE
            activities
        SET
            memo = 'Content: ' || NEW.content
        WHERE
            target_id = NEW.id;
    ELSIF (TG_OP = 'DELETE') THEN
        DELETE FROM activities
        WHERE target_id = OLD.id;
    END IF;
    RETURN NULL;
END;
$$
LANGUAGE plpgsql;

-- Create a trigger that inserts a record into the activities table when a new post is inserted, updated or deleted
CREATE TRIGGER post_insert_update_delete_trigger
    AFTER INSERT OR UPDATE OR DELETE ON posts
    FOR EACH ROW
    EXECUTE FUNCTION insert_activity_on_post_insert_update_delete ();

