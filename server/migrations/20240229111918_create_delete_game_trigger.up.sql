CREATE FUNCTION delete_data_on_delete_game ()
    RETURNS TRIGGER
    AS $$
BEGIN
    DELETE FROM notis
    WHERE parent_target_id = OLD.id
        OR target_id = OLD.id;
    DELETE FROM activities
    WHERE target_id = OLD.id;
    RETURN NULL;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER delete_game_trigger
    AFTER DELETE ON games
    FOR EACH ROW
    EXECUTE FUNCTION delete_data_on_delete_game ();

