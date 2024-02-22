-- Add up migration script here
-- Trigger function to insert into the activities table when a new game is inserted
create function insert_activity_on_game_insert()
returns trigger as $$
BEGIN
    INSERT INTO activities (user_id, target_type, target_id, memo)
    VALUES (NEW.author_id, 'added_game', NEW.id, 'Name: ' || NEW.name);
    RETURN NULL;
END;
$$ language plpgsql;

-- Create a trigger that inserts a record into the activities table when a new game is inserted
create trigger game_insert_trigger
after insert on games
for each row execute function insert_activity_on_game_insert();
