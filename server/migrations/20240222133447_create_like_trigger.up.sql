-- Add up migration script here
-- Trigger function to insert into the notis table when a new like is inserted
CREATE FUNCTION insert_noti_on_like_insert ()
    RETURNS TRIGGER
    AS $$
DECLARE
    noti_by_user_name varchar(100);
    noti_object_id uuid;
    noti_target_type varchar(100);
    noti_target_id uuid;
    noti_parent_target_id uuid;
    noti_to_user_id bigint;
BEGIN
    -- get user_name
    SELECT
        name INTO noti_by_user_name
    FROM
        users
    WHERE
        id = NEW.user_id;
    -- init object_id, target_type, target_id
    SELECT
        NEW.id,
        NEW.target_type,
        NEW.target_id INTO noti_object_id,
        noti_target_type,
        noti_target_id;
    -- CASE: like comment
    IF (noti_target_type = 'comments') THEN
        -- get id, target from comments
        SELECT
            user_id,
            target_type,
            target_id
        INTO noti_to_user_id,
            noti_target_type,
            noti_target_id
        FROM
            comments
        WHERE
            id = noti_target_id;
        -- CASE: comment discussion
        IF (noti_target_type = 'discussions') THEN
            SELECT
                'like_comment_discussion' INTO noti_target_type;
            SELECT
                game_id INTO noti_parent_target_id
            FROM
                discussions
            WHERE
                id = noti_target_id;
            -- CASE: comment blog
        ELSIF (noti_target_type = 'blogs') THEN
            SELECT
                'like_comment_blog' INTO noti_target_type;
            -- CASE: comment post
        ELSIF (noti_target_type = 'posts') THEN
            SELECT
                'like_comment_post' INTO noti_target_type;
        END IF;
        -- CASE: like discussion
    ELSIF (noti_target_type = 'discussions') THEN
        SELECT
            'like_discussion' INTO noti_target_type;
        SELECT
            user_id,
            game_id INTO noti_to_user_id,
            noti_parent_target_id
        FROM
            discussions
        WHERE
            id = noti_target_id;
        -- CASE: like post
    ELSIF (noti_target_type = 'posts') THEN
        SELECT
            'like_post' INTO noti_target_type;
        SELECT
            user_id INTO noti_to_user_id
        FROM
            posts
        WHERE
            id = noti_target_id;
    END IF;
    -- prevent noti to oneself
    IF (noti_to_user_id != NEW.user_id) THEN
        INSERT INTO notis (to_user_id, by_user_id, by_user_name, by_object_id, target_type, target_id, parent_target_id)
            VALUES (noti_to_user_id, NEW.user_id, noti_by_user_name, noti_object_id, noti_target_type::noti_type, noti_target_id, noti_parent_target_id);
    END IF;
    RETURN NULL;
END;
$$
LANGUAGE plpgsql;

-- Create a trigger that inserts a record into the notis table when a new like is inserted
CREATE TRIGGER like_insert_trigger
    AFTER INSERT ON likes
    FOR EACH ROW
    EXECUTE FUNCTION insert_noti_on_like_insert ();

-- Trigger function to delte from the notis table when a like is deleted
CREATE FUNCTION delete_noti_on_like_delete ()
    RETURNS TRIGGER
    AS $$
BEGIN
    DELETE FROM notis
    WHERE by_object_id = OLD.id;
    RETURN NULL;
END;
$$
LANGUAGE plpgsql;

-- Create a trigger that inserts a record into the notis table when a new like is inserted
CREATE TRIGGER like_delete_trigger
    AFTER DELETE ON likes
    FOR EACH ROW
    EXECUTE FUNCTION delete_noti_on_like_delete ();

