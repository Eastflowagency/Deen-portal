begin;

create table public.class_teachers (
  user_id uuid primary key references auth.users(id) on delete cascade
);

create table public.teacher_classes (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null unique references public.class_teachers(user_id),
  name text not null check (char_length(trim(name)) between 1 and 120),
  created_at timestamptz not null default now(),
  unique (id, owner_id)
);

create table public.class_students (
  user_id uuid primary key references auth.users(id) on delete cascade,
  class_id uuid not null,
  owner_id uuid not null,
  username text not null unique check (username ~ '^[a-z0-9][a-z0-9._-]{2,31}$'),
  full_name text not null check (char_length(trim(full_name)) between 1 and 120),
  created_at timestamptz not null default now(),
  foreign key (class_id, owner_id) references public.teacher_classes(id, owner_id) on delete cascade
);
create index class_students_owner_idx on public.class_students(owner_id);
create index class_students_class_idx on public.class_students(class_id);

alter table public.class_teachers enable row level security;
alter table public.teacher_classes enable row level security;
alter table public.class_students enable row level security;

revoke all on public.class_teachers, public.teacher_classes, public.class_students from anon, authenticated;
grant select on public.class_teachers, public.teacher_classes, public.class_students to authenticated;
grant insert on public.teacher_classes to authenticated;
grant all on public.class_teachers, public.teacher_classes, public.class_students to service_role;

create policy teacher_sees_self on public.class_teachers for select to authenticated
  using (user_id = (select auth.uid()));

create policy class_visible_to_owner_or_member on public.teacher_classes for select to authenticated
  using (owner_id = (select auth.uid()) or exists (
    select 1 from public.class_students s where s.class_id = teacher_classes.id and s.user_id = (select auth.uid())
  ));

create policy teacher_creates_own_class on public.teacher_classes for insert to authenticated
  with check (owner_id = (select auth.uid()) and exists (
    select 1 from public.class_teachers t where t.user_id = (select auth.uid())
  ));

-- Denormalized owner_id is protected by the composite FK above. No recursive RLS lookup.
create policy roster_visible_to_owner_or_self on public.class_students for select to authenticated
  using (owner_id = (select auth.uid()) or user_id = (select auth.uid()));

-- Membership writes go through the authenticated server endpoint only.
-- Neither students nor teachers can directly change ownership, enrollments, or teacher roles.
do $$
declare teacher_id uuid;
begin
  select id into teacher_id from auth.users where lower(email) = 'shabdullahi@alrawdah.no';
  if teacher_id is null then
    raise exception 'The designated teacher account must exist before applying this migration';
  end if;
  insert into public.class_teachers(user_id) values (teacher_id);
end $$;

commit;
