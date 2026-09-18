const { test } = require('node:test')
const assert = require('node:assert/strict')
const { randomUUID } = require('node:crypto')
const { readFileSync } = require('node:fs')
const { resolve } = require('node:path')
const { PGlite } = require(process.env.PGLITE_TEST_MODULE || '@electric-sql/pglite')

// Real PostgreSQL RLS in an isolated, in-memory database. No Supabase connection.
test('class migration enforces teacher and student isolation in PostgreSQL', async () => {
  const db = new PGlite()
  const [teacherA, teacherB, studentA, studentB, classA, classB] = Array.from({ length: 6 }, () => randomUUID())
  try {
    await db.exec(`
      create role anon;
      create role authenticated;
      create role service_role bypassrls;
      create schema auth;
      create table auth.users (id uuid primary key, email text);
      create function auth.uid() returns uuid language sql stable as
        $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
      grant usage on schema auth to authenticated;
    `)
    for (const [id, email] of [[teacherA, 'shabdullahi@alrawdah.no'], [teacherB, 'teacher-b@example.invalid'], [studentA, 'student-a@example.invalid'], [studentB, 'student-b@example.invalid']]) {
      await db.query('insert into auth.users(id, email) values ($1, $2)', [id, email])
    }
    await db.exec(readFileSync(resolve(__dirname, '../supabase/migrations/202609150001_teacher_classes.sql'), 'utf8'))
    await db.exec(readFileSync(resolve(__dirname, '../supabase/migrations/202609150002_student_moves.sql'), 'utf8'))
    assert.equal((await db.query('select user_id from class_teachers')).rows[0].user_id, teacherA)
    await db.query('insert into class_teachers values ($1)', [teacherB])
    await db.query('insert into teacher_classes(id, owner_id, name) values ($1,$2,$3), ($4,$5,$6)', [classA, teacherA, 'سعيد بن عامر', classB, teacherB, 'Class B'])
    await db.query('insert into class_students(user_id,class_id,owner_id,username,full_name) values ($1,$2,$3,$4,$5),($6,$7,$8,$9,$10)', [studentA,classA,teacherA,'student-a','Student A',studentB,classB,teacherB,'student-b','Student B'])

    async function asUser(id) {
      await db.exec('reset role')
      await db.query("select set_config('request.jwt.claim.sub', $1, false)", [id])
      await db.exec('set role authenticated')
    }
    for (const [teacher, ownClass, ownStudent] of [[teacherA,classA,studentA],[teacherB,classB,studentB]]) {
      await asUser(teacher)
      assert.deepEqual((await db.query('select user_id from class_teachers')).rows, [{ user_id: teacher }])
      assert.deepEqual((await db.query('select id from teacher_classes')).rows, [{ id: ownClass }])
      assert.deepEqual((await db.query('select user_id from class_students')).rows, [{ user_id: ownStudent }])
      await assert.rejects(db.query('insert into class_teachers values ($1)', [studentA]), { code: '42501' })
      await assert.rejects(db.query("update teacher_classes set name='Tampered'"), { code: '42501' })
      await assert.rejects(db.query('delete from class_students'), { code: '42501' })
      await assert.rejects(db.query('insert into teacher_classes(owner_id,name) values ($1,$2)', [teacher, 'Second class']), { code: '23505' })
    }
    await asUser(teacherA)
    await assert.rejects(db.query('insert into teacher_classes(owner_id,name) values ($1,$2)', [teacherB, 'Forged owner']), { code: '42501' })
    await assert.rejects(db.query('insert into class_students(user_id,class_id,owner_id,username,full_name) values ($1,$2,$3,$4,$5)', [studentA,classB,teacherB,'forged','Forged']), { code: '42501' })

    for (const [student, ownClass] of [[studentA,classA],[studentB,classB]]) {
      await asUser(student)
      assert.deepEqual((await db.query('select * from class_teachers')).rows, [])
      assert.deepEqual((await db.query('select id from teacher_classes')).rows, [{ id: ownClass }])
      assert.deepEqual((await db.query('select user_id from class_students')).rows, [{ user_id: student }])
      await assert.rejects(db.query('insert into teacher_classes(owner_id,name) values ($1,$2)', [student, 'Unauthorized']), { code: '42501' })
    }
    await db.exec('reset role; set role anon')
    for (const table of ['class_teachers','teacher_classes','class_students']) {
      await assert.rejects(db.query(`select * from ${table}`), { code: '42501' })
    }
    await db.exec('reset role; set role service_role')
    // Even a privileged enrollment cannot use an owner inconsistent with its class.
    await assert.rejects(db.query('update class_students set owner_id=$1 where user_id=$2', [teacherB,studentA]), { code: '23503' })
    await db.query('update class_students set deletion_pending=true where user_id=$1', [studentA])
    assert.equal((await db.query('update class_students set owner_id=$1,class_id=$2 where user_id=$3 and owner_id=$4 and deletion_pending=false returning user_id', [teacherB,classB,studentA,teacherA])).rows.length, 0)
    await db.query('update class_students set deletion_pending=false where user_id=$1', [studentA])
    assert.equal((await db.query('update class_students set owner_id=$1,class_id=$2 where user_id=$3 and owner_id=$4 and deletion_pending=false returning user_id', [teacherB,classB,studentA,teacherA])).rows.length, 1)
    await asUser(teacherA)
    assert.deepEqual((await db.query('select user_id from class_students')).rows, [])
    await asUser(teacherB)
    assert.equal((await db.query('select user_id from class_students')).rows.length, 2)
    await asUser(studentA)
    assert.deepEqual((await db.query('select id from teacher_classes')).rows, [{ id: classB }])
    await db.exec('reset role')
    await db.query('delete from auth.users where id=$1', [studentA])
    assert.equal((await db.query('select user_id from class_students where user_id=$1', [studentA])).rows.length, 0)
    assert.equal((await db.query('select user_id from class_students where user_id=$1', [studentB])).rows.length, 1)
  } finally { await db.close() }
})
