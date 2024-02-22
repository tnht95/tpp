-- Trigger function to insert into the activities table when a new user is inserted or updated
create function insert_activity_on_user_insert_update()
returns trigger as $$
BEGIN
    INSERT INTO activities (user_id, target_type, target_id, memo)
    VALUES (NEW.id, 'user', uuid_nil(), '');
    RETURN NULL;
END;
$$ language plpgsql;

-- Create a trigger that inserts a record into the activities table when a new user is inserted or updated
create trigger user_insert_update_trigger
after insert on users
for each row execute function insert_activity_on_user_insert_update();
