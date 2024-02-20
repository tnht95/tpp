-- Add up migration script here
-- Trigger function to insert into the activities table when a new post is inserted or updated
create function insert_activity_on_post_insert_update()
returns trigger as $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO activities (user_id, target_type, target_id, memo)
        VALUES (NEW.user_id, 'added_post', NEW.id, 'Content: ' || NEW.content);
    END IF;
    RETURN NULL;
END;
$$ language plpgsql;

-- Create a trigger that inserts a record into the activities table when a new post is inserted or updated
create trigger post_insert_update_trigger
after insert or update on posts
for each row execute function insert_activity_on_post_insert_update();
