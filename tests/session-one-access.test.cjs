const { test } = require('node:test')
const assert = require('node:assert/strict')
const { readFileSync } = require('node:fs')
const { resolve, dirname } = require('node:path')
const vm = require('node:vm')
const ts = require('typescript')
const uid = '00000000-0000-4000-8000-000000000001'
const target = '00000000-0000-4000-8000-000000000002'
function harness(options = {}) {
  const calls = [], cache = new Map()
  const user = options.signedOut ? null : { id: uid, email: 'forged@example.invalid', user_metadata: { full_name: 'Verified name', role: 'admin' } }
  const records = {
    app_accounts: [{ user_id: uid, role: options.role || 'student', status: options.suspended ? 'suspended' : 'active' }, { user_id: target, role: options.targetRole || 'student', status: 'active' }],
    class_teachers: [{ user_id: uid }],
    live_status: [{ id: 1, is_live: !options.ended, meeting_url: 'https://school.daily.co/current-room' }],
    live_speakers: options.speaker ? [{ room_name: 'current-room', user_id: uid, expires_at: new Date(Date.now()+3600000).toISOString() }] : [],
  }
  function from(table) {
    const filters = []; let write
    const query = {
      select() { return query }, eq(k,v) { filters.push(r => r[k] === v); return query }, neq(k,v) { filters.push(r => r[k] !== v); return query },
      in(k,v) { filters.push(r => v.includes(r[k])); return query }, order() { return query },
      update(value) { write = value; return query }, insert(value) { calls.push({ action: 'insert', table, value }); return query },
      async maybeSingle() { return result(true) }, async single() { return result(true) },
      then(a,b) { return Promise.resolve(result(false)).then(a,b) },
    }
    function result(single) {
      if (options.accessError && table === 'app_accounts') return { data: null, error: {} }
      const rows = (records[table] || []).filter(r => filters.every(f => f(r)))
      if (write) { calls.push({ action: 'update', table, value: write }); rows.forEach(r => Object.assign(r,write)) }
      return { data: single ? rows[0] || null : rows, error: null }
    }
    return query
  }
  const db = { from, auth: { getUser: async () => ({ data: { user }, error: null }), admin: {
    updateUserById: async (id, body) => { calls.push({ action: 'password', id, body }); return { error: null } },
  } } }
  function load(file) {
    const full = resolve(file)
    if(cache.has(full)) return cache.get(full)
    const module = { exports: {} }
    const stubs = {
      'server-only': {}, 'next/headers': { cookies: async () => ({ getAll: () => [], set() {} }) },
      '@supabase/ssr': { createServerClient: () => db }, '@supabase/supabase-js': { createClient: () => db },
      twilio: { default: () => ({ messages: { create: async value => { calls.push({ action: 'sms', value }); return {} } } }) },
    }
    vm.runInNewContext(ts.transpileModule(readFileSync(full,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{
      module, exports: module.exports, Response, Request, URL, Error, console, process: { env: { SUPABASE_SERVICE_ROLE_KEY: 'placeholder', DAILY_API_KEY: 'placeholder', TWILIO_ACCOUNT_SID: 'placeholder', TWILIO_AUTH_TOKEN: 'placeholder', TWILIO_FROM_NUMBER: 'placeholder' } },
      fetch: async (url,init) => { calls.push({ action: 'daily', url, body: JSON.parse(init.body || '{}') }); return Response.json({ token: 'test-token', url: 'https://school.daily.co/current-room' }) },
      require(name) { if(name in stubs) return stubs[name]; if(name.startsWith('@/')) return load(name.slice(2)+'.ts'); if(name.startsWith('.')) return load(resolve(dirname(full),name+'.ts')); throw Error(name) },
    })
    cache.set(full,module.exports); return module.exports
  }
  return { calls, load, records }
}
const request = body => new Request('http://localhost/test',{method:'POST',headers:{'Content-Type':'application/json','x-admin-email':'forged@example.invalid'},body:JSON.stringify(body)})

test('privileged endpoints reject signed-out, student, teacher and suspended admin callers before side effects', async () => {
  const routes = ['send-sms','create-daily-room','live-status','live-speakers','admin/accounts','admin/notifications']
  for(const options of [{signedOut:true},{role:'student'},{role:'teacher'},{role:'admin',suspended:true}]) {
    const h = harness(options)
    for(const route of routes) assert.equal((await h.load(`app/api/${route}/route.ts`).POST(request({role:'teacher',name:'current-room'}))).status,options.signedOut ? 401 : 403,route)
    assert.equal(h.calls.length,0)
  }
})
test('missing account schema fails closed before privileged work', async () => {
  const h = harness({role:'admin',accessError:true})
  assert.equal((await h.load('app/api/send-sms/route.ts').POST(request({}))).status,503)
  assert.equal(h.calls.length,0)
})
test('forged teacher role and display name cannot produce an owner token', async () => {
  const h = harness()
  const response = await h.load('app/api/daily-token/route.ts').POST(request({roomName:'current-room',role:'teacher',userName:'Fake host'}))
  assert.equal(response.status,200)
  const props = h.calls[0].body.properties
  assert.equal(props.is_owner,false); assert.equal(props.user_id,uid); assert.equal(props.user_name,'Verified name')
  assert.deepEqual(props.permissions,{canSend:[],canAdmin:[]})
  assert.equal(props.room_name,'current-room'); assert.ok(props.exp > Date.now()/1000)
})
test('other rooms, ended sessions, unauthorised speakers and suspended users cannot mint tokens', async () => {
  for(const [options,body,status] of [[{}, {roomName:'another-room'},403],[{ended:true},{roomName:'current-room'},403],[{}, {roomName:'current-room',role:'speaker'},403],[{suspended:true},{roomName:'current-room'},403],[{signedOut:true},{roomName:'current-room'},401]]) {
    const h = harness(options)
    assert.equal((await h.load('app/api/daily-token/route.ts').POST(request(body))).status,status)
    assert.equal(h.calls.length,0)
  }
})
test('verified admin receives owner token and granted student receives only speaking permissions', async () => {
  for(const options of [{role:'admin'},{speaker:true}]) {
    const h = harness(options)
    assert.equal((await h.load('app/api/daily-token/route.ts').POST(request({roomName:'current-room',role:'speaker'}))).status,200)
    const p = h.calls[0].body.properties
    assert.equal(p.is_owner,options.role === 'admin')
    if(!p.is_owner) assert.deepEqual(p.permissions,{canSend:['audio','video'],canAdmin:[]})
  }
})
test('legacy meetings endpoint cannot create a room for a student', async () => {
  const h = harness()
  assert.equal((await h.load('app/api/meetings/route.ts').POST(request({courseId:'arbitrary'}))).status,403)
  assert.equal(h.calls.length,0)
})
test('SMS normalizes and deduplicates recipients only after admin verification', async () => {
  const h = harness({role:'admin'})
  assert.equal((await h.load('app/api/send-sms/route.ts').POST(request({to:['4799999999','+4799999999'],message:'Test'}))).status,200)
  assert.equal(h.calls.length,1); assert.equal(h.calls[0].value.to,'+4799999999')
  assert.equal((await h.load('app/api/send-sms/route.ts').POST(request({to:[123],message:'Test'}))).status,400)
  assert.equal(h.calls.length,1)
})
test('account actions protect self/admin and validate roles and password scope', async () => {
  const h = harness({role:'admin'})
  const post = h.load('app/api/admin/accounts/route.ts').POST
  assert.equal((await post(request({action:'set_status',userId:uid,value:'suspended'}))).status,400)
  assert.equal((await post(request({action:'set_role',userId:target,value:'admin'}))).status,400)
  assert.equal((await post(request({action:'reset_password',userId:target,password:'short'}))).status,400)
  assert.equal(h.calls.length,0)
  assert.equal((await post(request({action:'set_status',userId:target,value:'suspended'}))).status,200)
  assert.equal(h.records.app_accounts[1].status,'suspended')
  const protectedAdmin = harness({role:'admin',targetRole:'admin'})
  assert.equal((await protectedAdmin.load('app/api/admin/accounts/route.ts').POST(request({action:'set_status',userId:target,value:'suspended'}))).status,403)
  assert.equal(protectedAdmin.calls.length,0)
})
