-- Add up migration script here
set
timezone = utc;

create
extension if not exists "uuid-ossp";
