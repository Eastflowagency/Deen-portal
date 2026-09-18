begin;

create table public.app_accounts (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'student' check (role in ('admin','teacher','student')),
  status text not null default 'active' check (status in ('active','suspended'))
);
insert into public.app_accounts(user_id, role)
select u.id, case when t.user_id is not null then 'teacher' else 'student' end
from auth.users u left join public.class_teachers t on t.user_id=u.id;

update public.app_accounts set role='admin' where user_id in (select id from auth.users where lower(email) in ('admin@alrawdah.no','shabdullahi@alrawdah.no','shabdirizak@alrawdah.no'));

create function public.register_app_account() returns trigger language plpgsql security definer set search_path='' as $$
begin
  insert into public.app_accounts(user_id) values (new.id);
  return new;
end $$;
create trigger register_app_account after insert on auth.users for each row execute function public.register_app_account();

create function public.current_app_role() returns text language sql stable security definer set search_path='' as $$
  select role from public.app_accounts where user_id=(select auth.uid()) and status='active'
$$;
revoke all on function public.current_app_role() from public;
grant execute on function public.current_app_role() to authenticated;
revoke all on function public.register_app_account() from public;

alter table public.app_accounts enable row level security;
revoke all on public.app_accounts from anon,authenticated;
grant select on public.app_accounts to authenticated;
grant all on public.app_accounts to service_role;
create policy account_read on public.app_accounts for select to authenticated
using (user_id=(select auth.uid()) or (select public.current_app_role())='admin');

-- Preserve class IDs and existing enrollments; allow multiple classes per teacher.
alter table public.teacher_classes drop constraint teacher_classes_owner_id_key;
alter table public.teacher_classes add column level integer not null default 1 check(level between 1 and 3);
create index teacher_classes_owner_idx on public.teacher_classes(owner_id);
alter table public.class_students drop constraint class_students_class_id_owner_id_fkey;
alter table public.class_students add constraint class_students_class_id_owner_id_fkey
foreign key(class_id,owner_id) references public.teacher_classes(id,owner_id) on delete cascade on update cascade;

drop policy teacher_sees_self on public.class_teachers;
create policy teacher_sees_self on public.class_teachers for select to authenticated
using ((select public.current_app_role()) is not null and (user_id=(select auth.uid()) or (select public.current_app_role())='admin'));
drop policy class_visible_to_owner_or_member on public.teacher_classes;
create policy class_visible_to_owner_or_member on public.teacher_classes for select to authenticated
using ((select public.current_app_role()) is not null and (owner_id=(select auth.uid()) or (select public.current_app_role())='admin' or exists (
 select 1 from public.class_students s where s.class_id=teacher_classes.id and s.user_id=(select auth.uid())
)));
drop policy teacher_creates_own_class on public.teacher_classes;
create policy teacher_creates_own_class on public.teacher_classes for insert to authenticated
with check ((select public.current_app_role()) in ('admin','teacher') and owner_id=(select auth.uid()) and exists(select 1 from public.class_teachers t where t.user_id=(select auth.uid())));
drop policy roster_visible_to_owner_or_self on public.class_students;
create policy roster_visible_to_owner_or_self on public.class_students for select to authenticated
using ((select public.current_app_role()) is not null and (owner_id=(select auth.uid()) or user_id=(select auth.uid()) or (select public.current_app_role())='admin'));

-- Keep the existing teacher FK registry synchronized with trusted account roles.
create function public.sync_teacher_role() returns trigger language plpgsql security definer set search_path='' as $$
begin
 if new.role in ('admin','teacher') then
   insert into public.class_teachers(user_id) values(new.user_id) on conflict do nothing;
 elsif old.role in ('admin','teacher') then
   delete from public.class_teachers where user_id=new.user_id;
 end if;
 return new;
end $$;
revoke all on function public.sync_teacher_role() from public;
create trigger sync_teacher_role after update of role on public.app_accounts for each row execute function public.sync_teacher_role();
insert into public.class_teachers select user_id from public.app_accounts where role in ('admin','teacher') on conflict do nothing;

create table public.live_speakers (
 room_name text not null,
 user_id uuid not null references auth.users(id) on delete cascade,
 expires_at timestamptz not null,
 primary key(room_name,user_id)
);
alter table public.live_speakers enable row level security;
revoke all on public.live_speakers from anon,authenticated;
grant all on public.live_speakers to service_role;

alter table if exists public.live_status add column if not exists time text not null default '';

-- Replace existing broad policies for the shared notification/live controls.
do $$ declare p record; tab text;
begin
 foreach tab in array array['notifications','live_status'] loop
  if to_regclass('public.'||tab) is not null then
   for p in select policyname from pg_policies where schemaname='public' and tablename=tab loop
    execute format('drop policy %I on public.%I',p.policyname,tab);
   end loop;
   execute format('alter table public.%I enable row level security',tab);
   execute format('revoke all on public.%I from anon, authenticated',tab);
   execute format('grant select on public.%I to authenticated',tab);
   execute format('grant all on public.%I to service_role',tab);
   execute format('create policy active_read on public.%I for select to authenticated using ((select public.current_app_role()) is not null)',tab);
   if tab = 'notifications' then
    execute 'drop policy active_read on public.notifications';
    execute 'create policy active_read on public.notifications for select to authenticated using ((select public.current_app_role()) is not null and (is_active or (select public.current_app_role())=''admin''))';
   end if;
  end if;
 end loop;
end $$;

create function public.admin_assign_class(target_class uuid, target_teacher uuid) returns void
language plpgsql security definer set search_path='' as $$
begin
 if not exists(select 1 from public.app_accounts where user_id=target_teacher and role in ('admin','teacher') and status='active') then
  raise exception 'Invalid teacher';
 end if;
 perform 1 from public.teacher_classes where id=target_class for update;
 if not found then raise exception 'Class not found'; end if;
 perform 1 from public.class_students where class_id=target_class for update;
 if exists(select 1 from public.class_students where class_id=target_class and deletion_pending) then
  raise exception 'Student deletion in progress';
 end if;
 update public.teacher_classes set owner_id=target_teacher where id=target_class;
end $$;
revoke all on function public.admin_assign_class(uuid,uuid) from public,anon,authenticated;
grant execute on function public.admin_assign_class(uuid,uuid) to service_role;

commit;
