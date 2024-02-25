-- Add up migration script here
-- Trigger function to insert into the activities table when a new game is inserted
CREATE FUNCTION insert_activity_on_game_insert ()
    RETURNS TRIGGER
    AS $$
BEGIN
    INSERT INTO activities (user_id, target_type, target_id, memo)
        VALUES (NEW.author_id, 'added_game', NEW.id, 'Name: ' || NEW.name);
    RETURN NULL;
END;
$$
LANGUAGE plpgsql;

-- Create a trigger that inserts a record into the activities table when a new game is inserted
CREATE TRIGGER game_insert_trigger
    AFTER INSERT ON games FOR EACH ROW
    EXECUTE FUNCTION insert_activity_on_game_insert ();

