-- Add down migration script here
DROP TRIGGER delete_blog_trigger ON blogs;

DROP FUNCTION delete_data_on_delete_blog;