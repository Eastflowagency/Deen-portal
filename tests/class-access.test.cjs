const { test } = require('node:test')
const assert = require('node:assert/strict')
const { randomBytes } = require('node:crypto')
const { readFileSync } = require('node:fs')
const { resolve } = require('node:path')
const vm = require('node:vm')
const ts = require('typescript')

// Execute the actual route and session code with an isolated, mocked Supabase boundary.
// No real accounts, environment files or network calls are used by these tests.
function load(file, dependencies = {}, env = {}) {
  const module = { exports: {} }
  const code = ts.transpileModule(readFileSync(resolve(__dirname, '..', file), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText
  vm.runInNewContext(code, {
    module, exports: module.exports, Response, Request, Error, URL,
    process: { env }, console: { error() {} },
    require(name) {
      assert.ok(name in dependencies, `Unexpected dependency: ${name}`)
      return dependencies[name]
    },
  }, { filename: file })
  return module.exports
}

function harness(options = {}) {
  const calls = []
  const user = options.signedOut ? null : { id: 'teacher-a', email: 'example@example.invalid', user_metadata: { role: 'admin', owner_id: 'teacher-b' } }
  function builder(table, privileged = false) {
    const query = { table, privileged, filters: [], fields: '', inserted: null }
    calls.push(query)
    function result(single = false) {
      if (table === 'app_accounts') return { data: { role: options.nonTeacher ? 'student' : 'teacher', status: 'active' }, error: null }
      if (table === 'class_teachers') return { data: options.nonTeacher ? null : { user_id: user.id }, error: options.roleError ? {} : null }
      if (table === 'teacher_classes') return { data: options.noClass ? (single ? null : []) : single ? { id: 'class-a', name: 'Class A', ...query.inserted } : [{ id: 'class-a', name: 'Class A' }], error: null }
      if (table === 'class_students' && privileged) {
        if (options.enrollmentThrows) throw new Error('Simulated network failure')
        return { data: options.enrollmentError ? null : { user_id: 'student-new', username: 'student.one', full_name: 'Student One', created_at: '2026-09-15' }, error: options.enrollmentError ? {} : null }
      }
      return { data: options.member ? { class_id: 'class-a', username: 'student.one', full_name: 'Student One' } : [], error: null }
    }
    const chain = {
      select(fields) { query.fields = fields; return chain },
      eq(key, value) { query.filters.push([key, value]); return chain },
      insert(value) { query.inserted = value; return chain },
      order() { return chain },
      async maybeSingle() { return result(true) },
      async single() { return result(true) },
      then(onSuccess, onError) { return Promise.resolve().then(result).then(onSuccess, onError) },
    }
    return chain
  }
  const db = {
    auth: { async getUser() { calls.push({ action: 'getUser' }); return { data: { user }, error: null } } },
    from: table => builder(table),
  }
  const admin = {
    from: table => builder(table, true),
    auth: { admin: {
      async createUser(input) {
        calls.push({ action: 'createUser', input })
        return { data: { user: options.duplicate ? null : { id: 'student-new' } }, error: options.duplicate ? { code: 'email_exists' } : null }
      },
      async deleteUser(id) {
        calls.push({ action: 'deleteUser', id })
        return { error: options.cleanupError ? {} : null }
      },
    } },
  }
  const env = options.missingKey ? {} : { SUPABASE_SERVICE_ROLE_KEY: 'test-placeholder' }
  const server = load('lib/class-server.ts', {
    '@/lib/access': load('lib/access.ts'),
    'server-only': {}, 'next/headers': { cookies: async () => ({ getAll: () => [], set() {} }) },
    '@supabase/ssr': { createServerClient: () => db },
    '@supabase/supabase-js': { createClient: () => admin },
  }, env)
  const login = load('lib/student-login.ts')
  const deps = { '@/lib/class-server': server, '@/lib/student-login': login }
  return {
    calls, login,
    classes: load('app/api/klasse/route.ts', deps, env),
    students: load('app/api/klasse/students/route.ts', deps, env),
    mine: load('app/api/my-class/route.ts', deps, env),
  }
}

function request(body, contentType = 'application/json') {
  return new Request('http://localhost/api/klasse/students', {
    method: 'POST', headers: { 'Content-Type': contentType, 'x-admin-email': 'shabdullahi@alrawdah.no' }, body: JSON.stringify(body),
  })
}
function student() { return { classId: 'class-a', fullName: 'Student One', username: 'Student.One', password: randomBytes(18).toString('hex') } }

test('all class APIs reject a signed-out request before reading class data', async () => {
  const h = harness({ signedOut: true })
  for (const response of [await h.classes.GET(), await h.classes.POST(request({ name: 'Class' })), await h.students.POST(request(student())), await h.mine.GET()]) {
    assert.equal(response.status, 401)
    assert.equal(response.headers.get('cache-control'), 'no-store')
  }
  assert.ok(h.calls.every(call => call.action === 'getUser'))
})

test('admin email headers and editable metadata do not grant teacher access', async () => {
  const h = harness({ nonTeacher: true })
  assert.equal((await h.classes.GET()).status, 403)
  assert.equal((await h.classes.POST(request({ name: 'Class', owner_id: 'teacher-b' }))).status, 403)
  assert.equal((await h.students.POST(request(student()))).status, 403)
  assert.ok(h.calls.filter(call => call.table).every(call => ['app_accounts','class_teachers'].includes(call.table)))
  assert.ok(!h.calls.some(call => call.action === 'createUser'))
})

test('missing teacher table fails closed', async () => {
  const h = harness({ roleError: true })
  assert.equal((await h.students.POST(request(student()))).status, 503)
  assert.ok(!h.calls.some(call => call.action === 'createUser'))
})

test('class and roster queries are scoped to the verified owner', async () => {
  const h = harness()
  assert.equal((await h.classes.GET()).status, 200)
  const classroom = h.calls.find(call => call.table === 'teacher_classes')
  const roster = h.calls.find(call => call.table === 'class_students')
  assert.deepEqual(classroom.filters, [['owner_id', 'teacher-a']])
  assert.deepEqual(roster.filters, [['class_id', 'class-a'], ['owner_id', 'teacher-a']])
  assert.ok(!roster.fields.includes('*') && !roster.fields.includes('password'))
})

test('class creation ignores forged owner and accepts an Arabic name', async () => {
  const h = harness()
  const response = await h.classes.POST(request({ name: ' سعيد بن عامر ', owner_id: 'teacher-b' }))
  assert.equal(response.status, 201)
  const inserted = h.calls.find(call => call.inserted).inserted
  assert.equal(inserted.owner_id, 'teacher-a')
  assert.equal(inserted.name, 'سعيد بن عامر')
})

test('class selection rejects a class absent from the verified owner list', async () => {
  const h = harness()
  assert.equal((await h.classes.GET(new Request('http://localhost/api/klasse?classId=class-b'))).status,404)
  assert.ok(!h.calls.some(call => call.table === 'class_students'))
})

test('class creation rejects invalid levels', async () => {
  const h = harness()
  for(const level of [0,4,'admin',1.5]) assert.equal((await h.classes.POST(request({name:'Class',level}))).status,400)
  assert.ok(!h.calls.some(call => call.inserted))
})

test('new accounts are enrolled only in the verified teacher class, without password disclosure', async () => {
  const h = harness()
  const input = student()
  const response = await h.students.POST(request({ ...input, owner_id: 'teacher-b', class_id: 'class-b', user_id: 'existing-user', role: 'admin' }))
  assert.equal(response.status, 201)
  const account = h.calls.find(call => call.action === 'createUser').input
  assert.equal(account.email, h.login.loginEmail(input.username))
  assert.equal(account.password, input.password)
  assert.equal(account.email_confirm, true)
  assert.deepEqual(Object.keys(account.user_metadata), ['full_name'])
  const enrollment = h.calls.find(call => call.table === 'class_students').inserted
  assert.equal(enrollment.class_id, 'class-a')
  assert.equal(enrollment.owner_id, 'teacher-a')
  assert.equal(enrollment.user_id, 'student-new')
  assert.ok(!('password' in enrollment))
  const text = await response.text()
  assert.ok(!text.includes(input.password) && !text.includes('password'))
})

test('student membership query uses the signed-in user only', async () => {
  const h = harness({ member: true })
  assert.equal((await h.mine.GET()).status, 200)
  assert.deepEqual(h.calls.find(call => call.table === 'class_students').filters, [['user_id', 'teacher-a']])
})

test('missing key or class cannot create an Auth account', async () => {
  for (const [options, status] of [[{ missingKey: true }, 503], [{ noClass: true }, 409]]) {
    const h = harness(options)
    assert.equal((await h.students.POST(request(student()))).status, status)
    assert.ok(!h.calls.some(call => call.action === 'createUser'))
  }
})

test('duplicate usernames do not enroll or delete an existing user', async () => {
  const h = harness({ duplicate: true })
  assert.equal((await h.students.POST(request(student()))).status, 409)
  assert.ok(!h.calls.some(call => call.table === 'class_students' || call.action === 'deleteUser'))
})

test('enrollment failures compensate only the newly created Auth user', async () => {
  for (const options of [{ enrollmentError: true }, { enrollmentThrows: true }]) {
    const h = harness(options)
    assert.equal((await h.students.POST(request(student()))).status, 503)
    assert.deepEqual(h.calls.filter(call => call.action === 'deleteUser'), [{ action: 'deleteUser', id: 'student-new' }])
  }
})

test('failed compensation reports an administrator repair requirement', async () => {
  const h = harness({ enrollmentError: true, cleanupError: true })
  const response = await h.students.POST(request(student()))
  assert.equal(response.status, 500)
  assert.match((await response.json()).error, /Kontakt administrator/)
})

test('invalid credentials and non-JSON requests cannot create accounts', async () => {
  const h = harness()
  for (const input of [null, {}, { ...student(), username: 'bad@email.invalid' }, { ...student(), password: 'short' }, { ...student(), username: '.first' }, { ...student(), fullName: ' ' }]) {
    assert.equal((await h.students.POST(request(input))).status, 400)
  }
  assert.equal((await h.students.POST(request(student(), 'text/plain'))).status, 415)
  assert.ok(!h.calls.some(call => call.action === 'createUser'))
})

test('username normalization preserves existing email login', () => {
  const { login } = harness()
  assert.equal(login.loginEmail(' Existing@Example.NO '), 'existing@example.no')
  assert.equal(login.loginEmail(' Student.One '), 'student.one@students.alrawdah.invalid')
  assert.equal(login.validateStudent({ ...student(), username: ' Student.One ' }).username, 'student.one')
})
