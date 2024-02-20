create or replace function insert_like(
    _user_id bigint,
    _target_id uuid,
    _target_type like_type
) returns void as $$
declare rows_affected boolean;
begin
execute format('
        update %I
        set likes = likes + 1
        where id = $1
        returning true
    ', _target_type)
    into rows_affected
    using _target_id;

if rows_affected is not null then
    insert into likes (user_id, target_id, target_type)
    values (_user_id, _target_id, _target_type);
end if;
-- do nothing if error
exception
    when others then
end;
$$ language plpgsql;


create or replace function delete_like(
    _user_id bigint,
    _target_id uuid,
    _target_type like_type
) returns void as $$
begin
delete from likes
where user_id = _user_id and target_id = _target_id;

if found then
    execute format('
        update %I
        set likes = likes - 1
        where id = $1
        ', _target_type)
    using _target_id;
end if;
end;
$$ language plpgsql;
