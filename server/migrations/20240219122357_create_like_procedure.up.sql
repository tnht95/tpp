create or replace function insert_like(
    _user_id bigint,
    _target_id uuid,
    _target_type like_target_types
) returns void as $$
DECLARE rows_affected boolean;
BEGIN
EXECUTE format('
        UPDATE %I
        SET likes = likes + 1
        WHERE id = $1
        RETURNING true
    ', _target_type)
    INTO rows_affected
    USING _target_id;

IF rows_affected IS NOT NULL THEN
    INSERT INTO likes (user_id, target_id, target_type)
    VALUES (_user_id, _target_id, _target_type);
END IF;

END;
$$ language plpgsql;

create or replace function delete_like(
    _user_id bigint,
    _target_id uuid,
    _target_type like_target_types
) returns void as $$
DECLARE rows_affected boolean;
BEGIN
EXECUTE format('
        UPDATE %I
        SET likes = likes - 1
        WHERE id = $1
        RETURNING true
    ', _target_type)
    INTO rows_affected
    USING _target_id;

IF rows_affected IS NOT NULL THEN
    DELETE FROM likes
    WHERE user_id = _user_id AND target_id = _target_id;
END IF;

END;
$$ language plpgsql;
