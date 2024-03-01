-- Add up migration script here
-- Trigger function to insert into the notis table when a new comment is inserted
CREATE FUNCTION insert_noti_on_comment_insert ()
    RETURNS TRIGGER
    AS $$
DECLARE
    noti_target_type varchar(100);
    noti_target_id uuid;
    noti_parent_target_id uuid;
    noti_to_user_id bigint;
    is_tag_user_same_with_author boolean;
BEGIN
    -- init target_type, target_id
    SELECT
        NEW.target_type,
        NEW.target_id INTO noti_target_type,
        noti_target_id;
    -- CASE: comment discussion
    IF (noti_target_type = 'discussions') THEN
        SELECT
            'comment_discussion' INTO noti_target_type;
        SELECT
            user_id,
            game_id INTO noti_to_user_id,
            noti_parent_target_id
        FROM
            discussions
        WHERE
            id = noti_target_id;
        -- CASE: comment blog
    ELSIF (noti_target_type = 'blogs') THEN
        SELECT
            'comment_blog' INTO noti_target_type;
        SELECT
            user_id INTO noti_to_user_id
        FROM
            blogs
        WHERE
            id = noti_target_id;
        -- CASE: comment post
    ELSIF (noti_target_type = 'posts') THEN
        SELECT
            'comment_post' INTO noti_target_type;
        SELECT
            user_id INTO noti_to_user_id
        FROM
            posts
        WHERE
            id = noti_target_id;
    END IF;
    -- tag comments
    WITH tag_users AS (
INSERT INTO notis (to_user_id, by_user_id, by_user_name, by_object_id, target_type, target_id, parent_target_id)
        SELECT
            users.id,
            NEW.user_id,
            NEW.user_name,
            NEW.id,
            CASE WHEN noti_target_type = 'comment_discussion' THEN
                'comment_tag_discussion'::noti_type
            WHEN noti_target_type = 'comment_blog' THEN
                'comment_tag_blog'::noti_type
            WHEN noti_target_type = 'comment_post' THEN
                'comment_tag_post'::noti_type
            END,
            noti_target_id,
            noti_parent_target_id
        FROM ( SELECT DISTINCT
                unnest(regexp_matches(NEW.content, '@([[:alnum:]]+-?[[:alnum:]]*)', 'g')) AS name) AS match_users
            INNER JOIN users ON users.name = match_users.name
                AND users.id != NEW.user_id
            RETURNING
                notis.to_user_id
)
    SELECT
        TRUE INTO is_tag_user_same_with_author
    FROM
        tag_users
WHERE
    tag_users.to_user_id = noti_to_user_id;
    -- prevent noti to oneself
    IF (noti_to_user_id != NEW.user_id AND is_tag_user_same_with_author is null) THEN
        INSERT INTO notis (to_user_id, by_user_id, by_user_name, by_object_id, target_type, target_id, parent_target_id)
            VALUES (noti_to_user_id, NEW.user_id, NEW.user_name, NEW.id, noti_target_type::noti_type, noti_target_id, noti_parent_target_id);
    END IF;
    RETURN NULL;
END;
$$
LANGUAGE plpgsql;

-- Create a trigger that inserts a record into the notis table when a new comment is inserted
CREATE TRIGGER comment_insert_trigger
    AFTER INSERT ON comments
    FOR EACH ROW
    EXECUTE FUNCTION insert_noti_on_comment_insert ();

