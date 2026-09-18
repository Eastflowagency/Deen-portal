begin;

create function public.can_manage_class(target uuid) returns boolean
language sql stable security definer set search_path='' as $$
 select coalesce((select public.current_app_role())='admin' or
   ((select public.current_app_role())='teacher' and exists(select 1 from public.teacher_classes where id=target and owner_id=(select auth.uid()))),false)
$$;
create function public.can_read_class(target uuid) returns boolean
language sql stable security definer set search_path='' as $$
 select public.can_manage_class(target) or ((select public.current_app_role())='student' and exists(select 1 from public.class_students where class_id=target and user_id=(select auth.uid())))
$$;
revoke all on function public.can_manage_class(uuid),public.can_read_class(uuid) from public,anon;
grant execute on function public.can_manage_class(uuid),public.can_read_class(uuid) to authenticated;

create table public.class_lessons (
 id uuid primary key default gen_random_uuid(),
 class_id uuid not null references public.teacher_classes(id) on delete cascade,
 course_slug text not null check(length(course_slug) between 1 and 80),
 title text not null check(length(trim(title)) between 1 and 160),
 summary text not null default '' check(length(summary)<=4000),
 book_pages text not null default '' check(length(book_pages)<=120),
 book_questions text not null default '' check(length(book_questions)<=120),
 published boolean not null default false,
 created_at timestamptz not null default now(),
 unique(id,class_id)
);
create index class_lessons_class_idx on public.class_lessons(class_id);
create table public.class_lesson_notes (
 lesson_id uuid primary key,
 class_id uuid not null,
 notes text not null default '' check(length(notes)<=8000),
 foreign key(lesson_id,class_id) references public.class_lessons(id,class_id) on delete cascade
);
create table public.class_sessions (
 id uuid primary key default gen_random_uuid(),
 class_id uuid not null references public.teacher_classes(id) on delete cascade,
 lesson_id uuid not null,
 starts_at timestamptz not null,
 ends_at timestamptz not null,
 status text not null default 'scheduled' check(status in ('scheduled','completed','cancelled')),
 foreign key(lesson_id,class_id) references public.class_lessons(id,class_id),
 check(ends_at>starts_at and ends_at<=starts_at+interval '12 hours'),
 unique(id,class_id)
);
create index class_sessions_time_idx on public.class_sessions(class_id,starts_at);
create table public.class_materials (
 id uuid primary key default gen_random_uuid(),
 class_id uuid not null,
 lesson_id uuid not null,
 title text not null check(length(trim(title)) between 1 and 160),
 url text check(url ~ '^https://' and length(url)<=2000),
 storage_path text unique,
 created_at timestamptz not null default now(),
 check((url is null) <> (storage_path is null)),
 check(storage_path is null or storage_path like class_id::text||'/'||lesson_id::text||'/%'),
 foreign key(lesson_id,class_id) references public.class_lessons(id,class_id) on delete cascade
);
create index class_materials_class_idx on public.class_materials(class_id);
create table public.class_announcements (
 id uuid primary key default gen_random_uuid(),
 class_id uuid not null references public.teacher_classes(id) on delete cascade,
 title text not null check(length(trim(title)) between 1 and 160),
 message text not null check(length(trim(message)) between 1 and 4000),
 published boolean not null default false,
 created_at timestamptz not null default now()
);
create index class_announcements_class_idx on public.class_announcements(class_id,created_at);
create table public.class_attendance (
 session_id uuid not null,
 class_id uuid not null,
 student_id uuid not null references auth.users(id) on delete cascade,
 student_name text not null,
 status text not null check(status in ('present','late','absent','excused')),
 marked_at timestamptz not null default now(),
 marked_by uuid references auth.users(id) on delete set null,
 primary key(session_id,student_id),
 foreign key(session_id,class_id) references public.class_sessions(id,class_id) on delete cascade
);
create index class_attendance_student_idx on public.class_attendance(student_id,class_id);

create function public.preserve_attendance_session() returns trigger language plpgsql set search_path='' as $$
begin
 if (new.lesson_id<>old.lesson_id or new.starts_at<>old.starts_at or new.ends_at<>old.ends_at or new.class_id<>old.class_id)
    and exists(select 1 from public.class_attendance where session_id=old.id) then
  raise exception 'A session with attendance cannot be rescheduled; create a new session';
 end if;
 return new;
end $$;
revoke all on function public.preserve_attendance_session() from public;
create trigger preserve_attendance_session before update on public.class_sessions for each row execute function public.preserve_attendance_session();

-- Derive identity snapshots server-side; a moved/deleting student cannot be newly marked.
create function public.validate_class_attendance() returns trigger
language plpgsql security definer set search_path='' as $$
declare student_label text;
begin
 if not public.can_manage_class(new.class_id) then raise exception 'Class access denied' using errcode='42501'; end if;
 if not exists(select 1 from public.class_sessions where id=new.session_id and class_id=new.class_id and status<>'cancelled' and starts_at<=now()) then
  raise exception 'Attendance requires a started, non-cancelled session';
 end if;
 select full_name into student_label from public.class_students where user_id=new.student_id and class_id=new.class_id and not deletion_pending for share;
 if not found then raise exception 'Student is not enrolled in this class'; end if;
 if TG_OP='UPDATE' and (new.session_id<>old.session_id or new.student_id<>old.student_id or new.class_id<>old.class_id) then raise exception 'Attendance identity is immutable'; end if;
 new.student_name=student_label;
 new.marked_by=auth.uid(); new.marked_at=now();
 return new;
end $$;
revoke all on function public.validate_class_attendance() from public;
create trigger validate_class_attendance before insert or update on public.class_attendance for each row execute function public.validate_class_attendance();

do $$ declare tab text;
begin
 foreach tab in array array['class_lessons','class_lesson_notes','class_sessions','class_materials','class_announcements','class_attendance'] loop
  execute format('alter table public.%I enable row level security',tab);
  execute format('revoke all on public.%I from anon,authenticated',tab);
  execute format('grant select,insert,update,delete on public.%I to authenticated',tab);
  execute format('grant all on public.%I to service_role',tab);
  execute format('create policy staff_manage on public.%I for all to authenticated using (public.can_manage_class(class_id)) with check (public.can_manage_class(class_id))',tab);
 end loop;
end $$;
create policy student_lessons on public.class_lessons for select to authenticated using(published and public.can_read_class(class_id));
create policy student_sessions on public.class_sessions for select to authenticated using(public.can_read_class(class_id) and exists(select 1 from public.class_lessons l where l.id=lesson_id and l.published));
create policy student_materials on public.class_materials for select to authenticated using(public.can_read_class(class_id) and exists(select 1 from public.class_lessons l where l.id=lesson_id and l.published));
create policy student_announcements on public.class_announcements for select to authenticated using(published and public.can_read_class(class_id));
create policy student_attendance on public.class_attendance for select to authenticated using((select public.current_app_role())='student' and student_id=(select auth.uid()));

-- Lesson content and its private notes are committed together under caller RLS.
create function public.save_class_lesson(lesson uuid, classroom uuid, course text, lesson_title text, description text, pages text, questions text, is_published boolean, private_notes text) returns uuid
language plpgsql security invoker set search_path='' as $$
declare saved uuid;
begin
 if lesson is null then
  insert into public.class_lessons(class_id,course_slug,title,summary,book_pages,book_questions,published)
  values(classroom,course,lesson_title,description,pages,questions,is_published) returning id into saved;
 else
  update public.class_lessons set course_slug=course,title=lesson_title,summary=description,book_pages=pages,book_questions=questions,published=is_published where id=lesson and class_id=classroom returning id into saved;
  if saved is null then raise exception 'Lesson not found' using errcode='42501'; end if;
 end if;
 insert into public.class_lesson_notes(lesson_id,class_id,notes) values(saved,classroom,private_notes)
 on conflict(lesson_id) do update set notes=excluded.notes;
 return saved;
end $$;
revoke all on function public.save_class_lesson(uuid,uuid,text,text,text,text,text,boolean,text) from public,anon;
grant execute on function public.save_class_lesson(uuid,uuid,text,text,text,text,text,boolean,text) to authenticated;

-- Private PDF storage. Object names are class UUID / lesson UUID / random UUID.pdf.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('class-materials','class-materials',false,10485760,array['application/pdf']);
create policy class_material_read on storage.objects for select to authenticated
using(bucket_id='class-materials' and (exists(select 1 from public.class_materials m where m.storage_path=name) or exists(select 1 from public.teacher_classes c where c.id::text=split_part(name,'/',1) and public.can_manage_class(c.id))));
create policy class_material_upload on storage.objects for insert to authenticated
with check(bucket_id='class-materials' and exists(select 1 from public.class_lessons l where l.class_id::text=split_part(name,'/',1) and l.id::text=split_part(name,'/',2) and public.can_manage_class(l.class_id)));
create policy class_material_remove on storage.objects for delete to authenticated
using(bucket_id='class-materials' and exists(select 1 from public.teacher_classes c where c.id::text=split_part(name,'/',1) and public.can_manage_class(c.id)));

-- Existing policies for other buckets must not accidentally expose this private bucket.
create policy class_material_read_guard on storage.objects as restrictive for select to authenticated
using(bucket_id<>'class-materials' or exists(select 1 from public.class_materials m where m.storage_path=name) or exists(select 1 from public.teacher_classes c where c.id::text=split_part(name,'/',1) and public.can_manage_class(c.id)));
create policy class_material_upload_guard on storage.objects as restrictive for insert to authenticated
with check(bucket_id<>'class-materials' or exists(select 1 from public.class_lessons l where l.class_id::text=split_part(name,'/',1) and l.id::text=split_part(name,'/',2) and public.can_manage_class(l.class_id)));
create policy class_material_remove_guard on storage.objects as restrictive for delete to authenticated
using(bucket_id<>'class-materials' or exists(select 1 from public.teacher_classes c where c.id::text=split_part(name,'/',1) and public.can_manage_class(c.id)));
create policy class_material_no_overwrite on storage.objects as restrictive for update to authenticated
using(bucket_id<>'class-materials') with check(bucket_id<>'class-materials');
create policy class_material_no_anon on storage.objects as restrictive for all to anon
using(bucket_id<>'class-materials') with check(bucket_id<>'class-materials');

commit;
