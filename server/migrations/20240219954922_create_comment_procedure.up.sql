CREATE OR REPLACE FUNCTION insert_comment (_user_id bigint, _target_id uuid, _target_type comment_type, _user_name varchar(100), _content varchar(200))
    RETURNS uuid
    AS $$
DECLARE
    rows_affected boolean;
    DECLARE new_id uuid;
BEGIN
    EXECUTE format('
        update %I
        set comments = comments + 1
        where id = $1
        returning true
    ', _target_type) INTO rows_affected
    USING _target_id;
    IF rows_affected IS NOT NULL THEN
        INSERT INTO comments (user_id, user_name, target_id, target_type, content)
            VALUES (_user_id, _user_name, _target_id, _target_type, _content)
        RETURNING
            id INTO new_id;
        RETURN new_id;
    END IF;
END;
$$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION delete_comment (_id uuid, _target_id uuid, _target_type comment_type)
    RETURNS void
    AS $$
BEGIN
    DELETE FROM comments
    WHERE id = _id;
    IF found THEN
        EXECUTE format('
        update %I
        set comments = comments - 1
        where id = $1
        ', _target_type)
        USING _target_id;
    END IF;
END;
$$
LANGUAGE plpgsql;

