begin;

-- Prevent a concurrent transfer while the Auth account is being deleted.
-- Only the server role can write memberships; existing RLS/grants are unchanged.
alter table public.class_students
  add column deletion_pending boolean not null default false;

commit;
