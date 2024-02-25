CREATE OR REPLACE FUNCTION insert_like (_user_id bigint, _target_id uuid, _target_type like_type)
    RETURNS void
    AS $$
DECLARE
    rows_affected boolean;
BEGIN
    EXECUTE format('
        update %I
        set likes = likes + 1
        where id = $1
        returning true
    ', _target_type) INTO rows_affected
    USING _target_id;
    IF rows_affected IS NOT NULL THEN
        INSERT INTO likes (user_id, target_id, target_type)
            VALUES (_user_id, _target_id, _target_type);
    END IF;
    -- do nothing if error
EXCEPTION
    WHEN OTHERS THEN
END;

$$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION delete_like (_user_id bigint, _target_id uuid, _target_type like_type)
    RETURNS void
    AS $$
BEGIN
    DELETE FROM likes
    WHERE user_id = _user_id
        AND target_id = _target_id;
    IF found THEN
        EXECUTE format('
        update %I
        set likes = likes - 1
        where id = $1
        ', _target_type)
        USING _target_id;
    END IF;
END;
$$
LANGUAGE plpgsql;

