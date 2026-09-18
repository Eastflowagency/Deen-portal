const { test } = require('node:test')
const assert = require('node:assert/strict')
const { randomUUID } = require('node:crypto')
const { readFileSync } = require('node:fs')
const { resolve } = require('node:path')
const { PGlite } = require(process.env.PGLITE_TEST_MODULE || '@electric-sql/pglite')

test('classroom migration protects drafts, private notes, files, schedules and attendance across classes', async () => {
  const db = new PGlite()
  const [admin, teacherA, teacherB, studentA, studentB, classA, classB, lessonA, draftA, sessionA, futureA] = Array.from({length:11},()=>randomUUID())
  try {
    await db.exec(`create role anon; create role authenticated; create role service_role bypassrls;
      create schema auth; create table auth.users(id uuid primary key,email text);
      create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
      grant usage on schema auth to authenticated;
      create schema storage;
      create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);
      create table storage.objects(id uuid primary key default gen_random_uuid(),bucket_id text,name text);
      alter table storage.objects enable row level security;
      grant usage on schema storage to anon,authenticated;
      grant all on storage.objects to anon,authenticated;
      create policy old_broad_policy on storage.objects for all to anon,authenticated using(true) with check(true);`)
    for(const [who,email] of [[admin,'shabdullahi@alrawdah.no'],[teacherA,'a@example.invalid'],[teacherB,'b@example.invalid'],[studentA,'s-a@example.invalid'],[studentB,'s-b@example.invalid']])await db.query('insert into auth.users values($1,$2)',[who,email])
    for(const migration of ['202609150001_teacher_classes','202609150002_student_moves'])await db.exec(readFileSync(resolve(__dirname,`../supabase/migrations/${migration}.sql`),'utf8'))
    await db.query('insert into class_teachers values($1),($2)',[teacherA,teacherB])
    for(const migration of ['202609160001_session_one','202609160002_session_two'])await db.exec(readFileSync(resolve(__dirname,`../supabase/migrations/${migration}.sql`),'utf8'))
    await db.query("insert into teacher_classes(id,owner_id,name) values($1,$2,'A'),($3,$4,'B')",[classA,teacherA,classB,teacherB])
    await db.query("insert into class_students(user_id,class_id,owner_id,username,full_name) values($1,$2,$3,'student-a','Student A'),($4,$5,$6,'student-b','Student B')",[studentA,classA,teacherA,studentB,classB,teacherB])
    async function as(who) {await db.exec('reset role');await db.query("select set_config('request.jwt.claim.sub',$1,false)",[who]);await db.exec('set role authenticated')}
    await as(teacherA)
    await db.query("insert into class_lessons(id,class_id,course_slug,title,published) values($1,$2,'aqidah-1','Lesson A',true),($3,$2,'fiqh-1','Private draft',false)",[lessonA,classA,draftA])
    await db.query("insert into class_lesson_notes values($1,$2,'Private teacher notes')",[lessonA,classA])
    await db.query("insert into class_announcements(class_id,title,message,published) values($1,'Published','Message',true),($1,'Draft','Hidden',false)",[classA])
    await db.query("insert into class_sessions(id,class_id,lesson_id,starts_at,ends_at) values($1,$2,$3,now()-interval '2 hours',now()-interval '1 hour'),($4,$2,$3,now()+interval '1 day',now()+interval '25 hours')",[sessionA,classA,lessonA,futureA])
    await assert.rejects(db.query("insert into class_sessions(class_id,lesson_id,starts_at,ends_at) values($1,$2,now(),now()+interval '1 hour')",[classA,randomUUID()]),{code:'23503'})
    const path=`${classA}/${lessonA}/${randomUUID()}.pdf`,draftPath=`${classA}/${draftA}/${randomUUID()}.pdf`
    await db.query("insert into storage.objects(bucket_id,name) values('class-materials',$1),('class-materials',$2)",[path,draftPath])
    await db.query("insert into class_materials(class_id,lesson_id,title,storage_path) values($1,$2,'PDF',$3),($1,$4,'Draft PDF',$5)",[classA,lessonA,path,draftA,draftPath])
    await assert.rejects(db.query("insert into storage.objects(bucket_id,name) values('class-materials',$1)",[`${classB}/${lessonA}/fake.pdf`]),{code:'42501'})
    await db.query("insert into class_attendance(session_id,class_id,student_id,status,student_name,marked_by) values($1,$2,$3,'late','Forged name',$4)",[sessionA,classA,studentA,teacherB])
    const recorded=(await db.query('select student_name,marked_by from class_attendance')).rows[0]
    assert.equal(recorded.student_name,'Student A');assert.equal(recorded.marked_by,teacherA)
    await assert.rejects(db.query("insert into class_attendance(session_id,class_id,student_id,status) values($1,$2,$3,'present')",[sessionA,classA,studentB]),/not enrolled/)
    await assert.rejects(db.query("insert into class_attendance(session_id,class_id,student_id,status) values($1,$2,$3,'present')",[futureA,classA,studentA]),/started/)
    await assert.rejects(db.query("update class_sessions set starts_at=starts_at-interval '1 hour' where id=$1",[sessionA]),/cannot be rescheduled/)
    // Saving a lesson and its private notes is atomic when note validation fails.
    const before=(await db.query('select count(*)::int as count from class_lessons')).rows[0].count
    await assert.rejects(db.query("select save_class_lesson(null,$1,'aqidah-1','Rollback','','','',true,$2)",[classA,'x'.repeat(8001)]),{code:'23514'})
    assert.equal((await db.query('select count(*)::int as count from class_lessons')).rows[0].count,before)
    await as(studentA)
    assert.equal((await db.query('select * from class_lessons')).rows.length,1)
    assert.equal((await db.query('select * from class_lesson_notes')).rows.length,0)
    assert.equal((await db.query('select * from class_announcements')).rows.length,1)
    assert.equal((await db.query('select * from class_materials')).rows.length,1)
    assert.equal((await db.query("select * from storage.objects where bucket_id='class-materials'")).rows.length,1)
    assert.equal((await db.query('select * from class_attendance')).rows.length,1)
    await assert.rejects(db.query("insert into class_lessons(class_id,course_slug,title) values($1,'aqidah-1','Forged')",[classA]),{code:'42501'})
    await assert.rejects(db.query("select save_class_lesson(null,$1,'aqidah-1','Forged','','','',true,'')",[classA]),{code:'42501'})
    assert.equal((await db.query("update class_attendance set status='present' returning *")).rows.length,0)
    for(const who of [teacherB,studentB]) {
      await as(who)
      for(const table of ['class_lessons','class_lesson_notes','class_sessions','class_announcements','class_materials','class_attendance'])assert.equal((await db.query(`select * from ${table}`)).rows.length,0)
      assert.equal((await db.query('select * from storage.objects')).rows.length,0)
      await assert.rejects(db.query("insert into storage.objects(bucket_id,name) values('class-materials',$1)",[`${classA}/${lessonA}/forged.pdf`]),{code:'42501'})
    }
    await db.exec('reset role; set role anon')
    assert.equal((await db.query('select * from storage.objects')).rows.length,0)
    await db.exec('reset role')
    await db.query("update app_accounts set status='suspended' where user_id=$1",[studentA])
    await as(studentA)
    assert.equal((await db.query('select * from class_lessons')).rows.length,0)
    assert.equal((await db.query('select * from class_attendance')).rows.length,0)
    assert.equal((await db.query('select * from storage.objects')).rows.length,0)
    await db.exec('reset role')
    await db.query("update app_accounts set status='active' where user_id=$1",[studentA])
    await db.query('update class_students set class_id=$1,owner_id=$2 where user_id=$3',[classB,teacherB,studentA])
    await as(studentA)
    assert.equal((await db.query('select * from class_lessons')).rows.length,0)
    assert.equal((await db.query('select * from class_attendance')).rows.length,1,'student retains their own historical attendance')
    await as(teacherA)
    await assert.rejects(db.query("update class_attendance set status='present' where student_id=$1",[studentA]),/not enrolled/)
    await as(admin)
    assert.equal((await db.query('select * from class_lesson_notes')).rows.length,1)
    assert.equal((await db.query('select * from class_attendance')).rows.length,1)
    assert.equal((await db.query('select * from storage.objects')).rows.length,2)
  } finally {await db.close()}
})
