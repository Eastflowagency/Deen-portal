const { test } = require('node:test')
const assert = require('node:assert/strict')
const { readFileSync } = require('node:fs')
const { resolve } = require('node:path')
const vm = require('node:vm')
const ts = require('typescript')

const teacherA = '00000000-0000-4000-8000-000000000001'
const teacherB = '00000000-0000-4000-8000-000000000002'
const studentId = '00000000-0000-4000-8000-000000000003'
const classA = '00000000-0000-4000-8000-000000000004'
const classB = '00000000-0000-4000-8000-000000000005'

function load(file, dependencies, env) {
  const module = { exports: {} }
  vm.runInNewContext(ts.transpileModule(readFileSync(resolve(__dirname, '..', file), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText, {
    module, exports: module.exports, Request, Response, Error, process: { env }, console: { error() {} },
    require(name) { assert.ok(name in dependencies, `Unexpected dependency ${name}`); return dependencies[name] },
  })
  return module.exports
}

function harness(options = {}) {
  const calls = []
  const state = {
    app_accounts: [{ user_id: teacherA, role: options.nonTeacher ? 'student' : 'teacher', status: 'active' }, { user_id: teacherB, role: 'teacher', status: 'active' }],
    class_teachers: options.nonTeacher ? [] : [{ user_id: teacherA }, { user_id: teacherB }, ...(options.targetTeacher || options.targetAdmin ? [{ user_id: studentId }] : [])],
    teacher_classes: [{ id: classA, owner_id: teacherA, name: 'Class A' }, { id: classB, owner_id: teacherB, name: 'Class B' }],
    class_students: [{ user_id: studentId, owner_id: options.otherOwner ? teacherB : teacherA, class_id: options.otherOwner ? classB : classA, username: 'student.one', deletion_pending: !!options.locked }],
  }
  function from(table, privileged = false) {
    const query = { table, privileged, filters: [], fields: '*', update: null }
    calls.push(query)
    function result(single = false) {
      if (query.update && options.beforeWrite) options.beforeWrite(state, query)
      if (query.update && options.writeError) return { data: null, error: { code: '42703' } }
      const rows = state[table].filter(row => query.filters.every(([key, value, unequal]) => unequal ? row[key] !== value : row[key] === value))
      if (query.update) rows.forEach(row => Object.assign(row, query.update))
      const data = rows.map(row => Object.fromEntries(query.fields.split(',').map(key => key.trim()).map(key => [key, row[key]])))
      return { data: single ? data[0] || null : data, error: null }
    }
    const chain = {
      select(fields) { query.fields = fields; return chain },
      eq(key, value) { query.filters.push([key, value, false]); return chain },
      neq(key, value) { query.filters.push([key, value, true]); return chain },
      update(value) { query.update = value; return chain },
      order() { return chain },
      async maybeSingle() { return result(true) },
      then(onSuccess, onError) { return Promise.resolve().then(() => result()).then(onSuccess, onError) },
    }
    return chain
  }
  const db = {
    from: table => from(table),
    auth: { async getUser() { return { data: { user: options.signedOut ? null : { id: teacherA } }, error: null } } },
  }
  const admin = {
    from: table => from(table, true),
    auth: { admin: {
      async getUserById(id) { calls.push({ action: 'getUserById', id }); return { data: { user: { id, email: options.regularEmail ? 'existing@example.no' : 'student.one@students.alrawdah.invalid' } }, error: null } },
      async deleteUser(id, softDelete) {
        calls.push({ action: 'deleteUser', id, softDelete })
        if (options.deleteThrows) throw new Error('Simulated network failure')
        if (options.deleteError) return { error: { message: 'Simulated failure' } }
        state.class_students = state.class_students.filter(row => row.user_id !== id)
        return { error: null }
      },
    } },
  }
  const env = { SUPABASE_SERVICE_ROLE_KEY: 'test-placeholder', ...(options.targetAdmin ? { NEXT_PUBLIC_ADMIN_EMAILS: 'student.one@students.alrawdah.invalid' } : {}) }
  const server = load('lib/class-server.ts', {
    '@/lib/access': load('lib/access.ts', {}, env),
    'server-only': {}, 'next/headers': { cookies: async () => ({ getAll: () => [], set() {} }) },
    '@supabase/ssr': { createServerClient: () => db }, '@supabase/supabase-js': { createClient: () => admin },
  }, env)
  const deps = { '@/lib/class-server': server, '@/lib/student-login': load('lib/student-login.ts', {}, env) }
  return { state, calls,
    remove: load('app/api/klasse/students/route.ts', deps, env).DELETE,
    move: load('app/api/klasse/students/transfer/route.ts', deps, env).POST,
    destinations: load('app/api/klasse/destinations/route.ts', deps, env).GET,
  }
}

const request = body => new Request('http://localhost/api/klasse/students', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-admin-email': 'forged@example.no' }, body: JSON.stringify(body) })
const deletion = extra => request({ studentId, confirmation: 'slett', ...extra })
const transfer = extra => request({ studentId, destinationClassId: classB, ...extra })

test('signed-out and non-teacher users cannot delete, transfer or list destinations', async () => {
  for (const [options, status] of [[{ signedOut: true }, 401], [{ nonTeacher: true }, 403]]) {
    const h = harness(options)
    assert.equal((await h.remove(deletion())).status, status)
    assert.equal((await h.move(transfer())).status, status)
    assert.equal((await h.destinations()).status, status)
    assert.ok(!h.calls.some(call => call.privileged || call.action))
  }
})

test('a teacher cannot affect a student owned by another teacher', async () => {
  const h = harness({ otherOwner: true })
  assert.equal((await h.remove(deletion({ owner_id: teacherB }))).status, 404)
  assert.equal((await h.move(transfer({ owner_id: teacherB }))).status, 404)
  assert.ok(!h.calls.some(call => call.privileged || call.action))
})

test('deletion requires a valid target, lowercase slett and protects self', async () => {
  const h = harness()
  assert.equal((await h.remove(deletion({ studentId: 'not-a-uuid' }))).status, 400)
  for (const confirmation of ['Fahima', 'student.one', '', '   ', 'SLETT', 'Slett', 'slett elev', null, 123]) {
    assert.equal((await h.remove(deletion({ confirmation }))).status, 400)
  }
  assert.equal((await h.remove(request({ studentId, username: 'student.one' }))).status, 400)
  assert.equal((await h.remove(deletion({ studentId: teacherA }))).status, 403)
  assert.ok(!h.calls.some(call => call.action === 'deleteUser'))
})

test('deletion accepts lowercase slett with surrounding whitespace', async () => {
  const h = harness()
  assert.equal((await h.remove(deletion({ confirmation: '  slett\n' }))).status, 200)
  assert.equal(h.calls.filter(call => call.action === 'deleteUser').length, 1)
})

test('teacher, admin and existing email accounts cannot be deleted here', async () => {
  for (const options of [{ targetTeacher: true }, { targetAdmin: true }, { regularEmail: true }]) {
    const h = harness(options)
    assert.equal((await h.remove(deletion())).status, 403)
    assert.ok(!h.calls.some(call => call.action === 'deleteUser' || call.update))
  }
})

test('owned student deletion reserves membership and hard-deletes only the selected account', async () => {
  const h = harness()
  const response = await h.remove(deletion({ owner_id: teacherB }))
  assert.equal(response.status, 200)
  assert.deepEqual(await response.json(), { deletedStudentId: studentId })
  assert.deepEqual(h.calls.filter(call => call.action === 'deleteUser'), [{ action: 'deleteUser', id: studentId, softDelete: false }])
  assert.equal(h.calls.find(call => call.update).update.deletion_pending, true)
  assert.equal(h.state.class_students.length, 0)
  assert.equal(h.state.class_teachers.length, 2)
})

test('failed Auth deletion retains membership and releases its reservation', async () => {
  for (const options of [{ deleteError: true }, { deleteThrows: true }]) {
    const h = harness(options)
    assert.equal((await h.remove(deletion())).status, 503)
    assert.equal(h.state.class_students.length, 1)
    assert.equal(h.state.class_students[0].deletion_pending, false)
  }
})

test('an ownership change between authorization and reservation prevents deletion', async () => {
  const h = harness({ beforeWrite(state) { state.class_students[0].owner_id = teacherB; state.class_students[0].class_id = classB } })
  assert.equal((await h.remove(deletion())).status, 409)
  assert.ok(!h.calls.some(call => call.action === 'deleteUser'))
})

test('pending deletion or missing migration blocks both mutations', async () => {
  for (const [options, status] of [[{ locked: true }, 409], [{ writeError: true }, 503]]) {
    const h = harness(options)
    assert.equal((await h.remove(deletion())).status, status)
    assert.equal((await h.move(transfer())).status, status)
    assert.ok(!h.calls.some(call => call.action === 'deleteUser'))
  }
})

test('transfer derives destination ownership and preserves username and Auth account', async () => {
  const h = harness()
  assert.equal((await h.move(transfer({ owner_id: teacherA, destinationOwnerId: teacherA }))).status, 200)
  assert.equal(h.state.class_students[0].owner_id, teacherB)
  assert.equal(h.state.class_students[0].class_id, classB)
  assert.equal(h.state.class_students[0].username, 'student.one')
  assert.ok(!h.calls.some(call => call.action))
  assert.equal((await h.move(transfer())).status, 404)
  assert.equal((await h.remove(deletion())).status, 404)
})

test('transfer rejects nonexistent and current destinations', async () => {
  const h = harness()
  assert.equal((await h.move(transfer({ destinationClassId: classA }))).status, 400)
  assert.equal((await h.move(transfer({ destinationClassId: studentId }))).status, 400)
  assert.equal(h.state.class_students[0].class_id, classA)
})

test('transfer rechecks current ownership at the atomic write', async () => {
  const h = harness({ beforeWrite(state) { state.class_students[0].owner_id = teacherB; state.class_students[0].class_id = classB } })
  assert.equal((await h.move(transfer())).status, 409)
})

test('destination picker exposes only other class IDs and names', async () => {
  const h = harness()
  const response = await h.destinations()
  assert.equal(response.status, 200)
  assert.equal(response.headers.get('cache-control'), 'no-store')
  assert.deepEqual(await response.json(), { destinations: [{ id: classA, name: 'Class A' }, { id: classB, name: 'Class B' }] })
  assert.ok(!h.calls.some(call => call.table === 'class_students'))
})
