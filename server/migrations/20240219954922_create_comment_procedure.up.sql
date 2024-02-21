create or replace function insert_comment(
    _user_id bigint,
    _target_id uuid,
    _target_type comment_type,
    _user_name varchar(100),
    _content varchar(200)
) returns uuid as $$
declare rows_affected boolean;
declare new_id uuid;
begin
execute format('
        update %I
        set comments = comments + 1
        where id = $1
        returning true
    ', _target_type)
    into rows_affected
    using _target_id;

if rows_affected is not null then
    insert into comments (user_id, user_name, target_id, target_type, content)
    values (_user_id, _user_name, _target_id, _target_type, _content)
    returning id into new_id;
return new_id;
end if;

end;
$$ language plpgsql;

create or replace function delete_comment(
    _id uuid,
    _target_id uuid,
    _target_type comment_type
) returns void as $$
begin
delete from comments
where id = _id;

if found then
    execute format('
        update %I
        set comments = comments - 1
        where id = $1
        ', _target_type)
    using _target_id;
end if;
end;
$$ language plpgsql;
