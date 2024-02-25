-- Trigger function to insert into the activities table when a new user is inserted
CREATE FUNCTION insert_activity_on_user_insert ()
    RETURNS TRIGGER
    AS $$
BEGIN
    INSERT INTO activities (user_id, target_type, target_id, memo)
        VALUES (NEW.id, 'user', uuid_nil (), '');
    RETURN NULL;
END;
$$
LANGUAGE plpgsql;

-- Create a trigger that inserts a record into the activities table when a new user is inserted
CREATE TRIGGER user_insert_trigger
    AFTER INSERT ON users
    FOR EACH ROW
    EXECUTE FUNCTION insert_activity_on_user_insert ();

