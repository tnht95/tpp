-- Add up migration script here
CREATE FUNCTION delete_data_on_delete_blog ()
    RETURNS TRIGGER
AS $$
BEGIN
DELETE FROM notis
WHERE target_id = OLD.id;
DELETE FROM comments
WHERE target_id = OLD.id;
DELETE FROM likes
WHERE target_id = OLD.id;
RETURN NULL;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER delete_blog_trigger
    AFTER DELETE ON blogs
    FOR EACH ROW
    EXECUTE FUNCTION delete_data_on_delete_blog ();