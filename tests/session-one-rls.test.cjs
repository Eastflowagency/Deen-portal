const { test } = require('node:test')
const assert = require('node:assert/strict')
const { randomUUID } = require('node:crypto')
const { readFileSync } = require('node:fs')
const { resolve } = require('node:path')
const { PGlite } = require(process.env.PGLITE_TEST_MODULE || '@electric-sql/pglite')

test('session one preserves accounts and memberships, isolates multiple classes and blocks suspended access', async () => {
  const db = new PGlite()
  const [admin, teacher, other, student, classA, classB, classC] = Array.from({ length: 7 }, randomUUID)
  try {
    await db.exec(`create role anon; create role authenticated; create role service_role bypassrls;
      create schema auth; create table auth.users(id uuid primary key, email text);
      create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
      grant usage on schema auth to authenticated;
      create table public.notifications(id uuid primary key default gen_random_uuid(), title text, message text, is_active boolean, created_at timestamptz default now());
      create table public.live_status(id int primary key, is_live boolean, meeting_url text);
      alter table notifications enable row level security;
      create policy old_open on notifications for all to authenticated using(true) with check(true);
      grant all on notifications,live_status to anon,authenticated;
      insert into notifications(title,is_active) values('visible',true),('hidden',false);`)
    for (const [id,email] of [[admin,'shabdullahi@alrawdah.no'],[teacher,'teacher@example.invalid'],[other,'other@example.invalid'],[student,'student@example.invalid']]) await db.query('insert into auth.users values($1,$2)',[id,email])
    for (const name of ['202609150001_teacher_classes','202609150002_student_moves']) await db.exec(readFileSync(resolve(__dirname,`../supabase/migrations/${name}.sql`),'utf8'))
    await db.query('insert into class_teachers values($1),($2)',[teacher,other])
    await db.query('insert into teacher_classes(id,owner_id,name) values($1,$2,$3)',[classA,teacher,'Preserved class'])
    await db.query('insert into class_students(user_id,class_id,owner_id,username,full_name) values($1,$2,$3,$4,$5)',[student,classA,teacher,'learner','Learner'])
    await db.exec(readFileSync(resolve(__dirname,'../supabase/migrations/202609160001_session_one.sql'),'utf8'))
    assert.equal((await db.query('select role from app_accounts where user_id=$1',[admin])).rows[0].role,'admin')
    assert.equal((await db.query('select role from app_accounts where user_id=$1',[teacher])).rows[0].role,'teacher')
    assert.equal((await db.query('select class_id from class_students where user_id=$1',[student])).rows[0].class_id,classA)
    async function asUser(id) { await db.exec('reset role'); await db.query("select set_config('request.jwt.claim.sub',$1,false)",[id]); await db.exec('set role authenticated') }
    await asUser(teacher)
    await db.query('insert into teacher_classes(id,owner_id,name) values($1,$2,$3)',[classB,teacher,'Second class'])
    await assert.rejects(db.query('insert into teacher_classes(id,owner_id,name) values($1,$2,$3)',[classC,other,'Forged']),{code:'42501'})
    assert.equal((await db.query('select id from teacher_classes')).rows.length,2)
    await assert.rejects(db.exec("update app_accounts set role='admin'"),{code:'42501'})
    await assert.rejects(db.exec("insert into notifications(title) values('forged')"),{code:'42501'})
    await assert.rejects(db.query('select admin_assign_class($1,$2)',[classA,other]),{code:'42501'})
    await asUser(other)
    assert.equal((await db.query('select * from class_students')).rows.length,0)
    assert.equal((await db.query('select * from teacher_classes')).rows.length,0)
    await asUser(student)
    assert.equal((await db.query('select id from teacher_classes')).rows.length,1)
    assert.equal((await db.query('select * from notifications')).rows.length,1)
    await assert.rejects(db.exec('select * from live_speakers'),{code:'42501'})
    await db.exec('reset role')
    await db.query("update app_accounts set status='suspended' where user_id=$1",[student])
    await asUser(student)
    for (const table of ['teacher_classes','class_students','notifications','live_status']) assert.equal((await db.query(`select * from ${table}`)).rows.length,0)
    assert.equal((await db.query('select current_app_role() as role')).rows[0].role,null)
    await db.exec('reset role')
    await db.query("update app_accounts set status='active' where user_id=$1",[student])
    await db.query('update class_students set deletion_pending=true where user_id=$1',[student])
    await assert.rejects(db.query('select admin_assign_class($1,$2)',[classA,other]),/deletion/)
    await db.query('update class_students set deletion_pending=false where user_id=$1',[student])
    await db.query('select admin_assign_class($1,$2)',[classA,other])
    assert.equal((await db.query('select owner_id from class_students')).rows[0].owner_id,other)
    await assert.rejects(db.query("update app_accounts set role='student' where user_id=$1",[other]),{code:'23503'})
    await asUser(teacher)
    assert.equal((await db.query('select * from class_students')).rows.length,0)
    await asUser(other)
    assert.equal((await db.query('select * from class_students')).rows.length,1)
    await asUser(admin)
    assert.equal((await db.query('select * from notifications')).rows.length,2)
    assert.equal((await db.query('select * from teacher_classes')).rows.length,2)
    await db.exec('reset role')
    const fresh = randomUUID()
    await db.query('insert into auth.users values($1,$2)',[fresh,'new@example.invalid'])
    assert.equal((await db.query('select role from app_accounts where user_id=$1',[fresh])).rows[0].role,'student')
  } finally { await db.close() }
})
