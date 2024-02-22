-- Add up migration script here
-- Trigger function to insert into the activities table when a new post is inserted, updated or deleted
create function insert_activity_on_post_insert_update_delete()
returns trigger as $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO activities (user_id, target_type, target_id, memo)
        VALUES (NEW.user_id, 'post', NEW.id, 'Content: ' || NEW.content);
    ELSIF (TG_OP = 'UPDATE') THEN
        UPDATE activities SET memo = 'Content: ' || NEW.content WHERE target_id = NEW.id;
    ELSE
        DELETE FROM activities WHERE target_id = OLD.id;
    END IF;
    RETURN NULL;
END;
$$ language plpgsql;

-- Create a trigger that inserts a record into the activities table when a new post is inserted, updated or deleted
create trigger post_insert_update_delete_trigger
after insert or update or delete on posts
for each row execute function insert_activity_on_post_insert_update_delete();
