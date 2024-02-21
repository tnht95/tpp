-- Trigger function to insert into the activities table when a new user is inserted or updated
create function insert_activity_on_user_insert_update()
returns trigger as $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO activities (user_id, target_type, target_id, memo)
        VALUES (NEW.id, 'user_joined', uuid_nil(), '');
    END IF;
    RETURN NULL;
END;
$$ language plpgsql;

-- Create a trigger that inserts a record into the activities table when a new user is inserted or updated
create trigger user_insert_update_trigger
after insert or update on users
for each row execute function insert_activity_on_user_insert_update();
