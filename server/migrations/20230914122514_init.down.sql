-- Add down migration script here
drop table books;
drop extension if exists "uuid-ossp";
