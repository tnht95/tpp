-- Add up migration script here
-- Trigger function to insert into the activities table when a new like is inserted
create function insert_noti_on_like_insert() returns trigger as $$
declare
    noti_by_user_name varchar(100);
    noti_target_type varchar(100);
    noti_target_id uuid;
    noti_parent_target_id uuid;
    noti_to_user_id bigint;
begin
    -- get user_name
    select name into noti_by_user_name from users where id = new.user_id;

    -- init target_type, target_id
    select new.target_type, new.target_id into noti_target_type, noti_target_id;

    -- CASE: like comment
    if (noti_target_type = 'comments') then

      -- get target from comments
      select target_type, target_id into noti_target_type, noti_target_id from comments where id = noti_target_id;

      -- CASE: comment discussion
      if (noti_target_type = 'discussions') then
        select 'like_comment_discussion' into noti_target_type;
        select user_id, game_id into noti_to_user_id, noti_parent_target_id from discussions where id = noti_target_id;

      -- CASE: comment blog
      elsif (noti_target_type = 'blogs') then
        select 'like_comment_blog' into noti_target_type;
        -- hack: only admin can add blog
        select 40195902 into noti_to_user_id;

      -- CASE: comment post
      elsif (noti_target_type = 'posts') then
        select 'like_comment_post' into noti_target_type;
        select user_id into noti_to_user_id from posts where id = noti_target_id;
      end if;

    -- CASE: like discussion
    elsif (noti_target_type = 'discussions') then
        select 'like_discussion' into noti_target_type;
        select user_id, game_id into noti_to_user_id, noti_parent_target_id from discussions where id = noti_target_id;

    -- CASE: like post
    elsif (noti_target_type = 'posts') then
        select 'like_post' into noti_target_type;
        select user_id into noti_to_user_id from posts where id = noti_target_id;
    end if;

    insert into notis (to_user_id, by_user_id, by_user_name, target_type, target_id, parent_target_id)
    values(noti_to_user_id, new.user_id, noti_by_user_name, noti_target_type::noti_type, noti_target_id, noti_parent_target_id);

    return null;
end;
$$ language plpgsql;

-- Create a trigger that inserts a record into the activities table when a new like is inserted

create trigger like_insert_trigger
after insert on likes
for each row execute function insert_noti_on_like_insert();
