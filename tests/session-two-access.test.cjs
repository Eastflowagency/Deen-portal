const {test}=require('node:test')
const assert=require('node:assert/strict')
const {readFileSync,existsSync}=require('node:fs')
const {resolve,dirname}=require('node:path')
const vm=require('node:vm')
const ts=require('typescript')
const classId='00000000-0000-4000-8000-000000000001',userId='00000000-0000-4000-8000-000000000002',lessonId='00000000-0000-4000-8000-000000000003',sessionId='00000000-0000-4000-8000-000000000004',studentId='00000000-0000-4000-8000-000000000005'
class ClassError extends Error {constructor(status,message){super(message);this.status=status}}
function harness(options={}) {
  const calls=[],cache=new Map()
  const tables={teacher_classes:[{id:classId,name:'Class',level:1,owner_id:options.foreign?'other':userId}],class_sessions:[{id:sessionId,class_id:classId,starts_at:options.future?'2099-01-01T10:00:00Z':'2020-01-01T10:00:00Z',status:options.cancelled?'cancelled':'scheduled'}],class_materials:options.material?[{id:lessonId,class_id:classId,storage_path:'private.pdf',url:null}]:[],class_lessons:[{id:lessonId,class_id:classId,published:true}],class_students:[],class_attendance:[],class_lesson_notes:[],class_announcements:[]}
  function from(table) {
    const filters=[];let mutation,range
    function result(single=false) {
      if(mutation){calls.push({table,...mutation});return{data:{id:lessonId},error:null}}
      let rows=(tables[table]||[]).filter(r=>filters.every(([k,v])=>r[k]===v))
      if(range)rows=rows.slice(range[0],range[1]+1)
      return{data:single?rows[0]||null:rows,error:null}
    }
    const q={select(){return q},eq(k,v){filters.push([k,v]);return q},order(){return q},range(a,b){range=[a,b];calls.push({action:'range',table,a,b});return q},
      insert(value){mutation={action:'insert',value};return q},update(value){mutation={action:'update',value};return q},upsert(value){mutation={action:'upsert',value};return q},delete(){mutation={action:'delete'};return q},
      async maybeSingle(){return result(true)},async single(){return result(true)},then(a,b){return Promise.resolve(result()).then(a,b)}}
    return q
  }
  const db={from,rpc:async(name,args)=>{calls.push({action:'rpc',name,args});return{data:lessonId,error:null}},storage:{from:()=>({createSignedUrl:async(path,seconds)=>{calls.push({action:'signed',path,seconds});return{data:{signedUrl:'https://files.example.invalid/signed'},error:null}},upload:async()=>{calls.push({action:'upload'});return{error:null}},remove:async()=>({error:null})})}}
  const server={ClassError,classFailure:e=>Response.json({error:e instanceof ClassError?e.message:'Internal error'},{status:e instanceof ClassError?e.status:500}),
    classSession:async()=>{if(options.signedOut)throw new ClassError(401,'Sign in');if(options.suspended)throw new ClassError(403,'Suspended');return{db,user:{id:userId},access:{role:options.role||'teacher',status:'active'}}},
    classAdmin:()=>({auth:{admin:{getUserById:async()=>({data:{user:{user_metadata:{full_name:'Teacher'}}}})}}}),
    jsonBody:async(request,max=4096)=>{const value=await request.text();if(value.length>max)throw new ClassError(413,'Too large');return JSON.parse(value)},
  }
  function load(file) {
    let full=resolve(file);if(!existsSync(full))full=full.replace(/\.ts$/,'/index.ts');if(cache.has(full))return cache.get(full)
    const module={exports:{}}
    vm.runInNewContext(ts.transpileModule(readFileSync(full,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{module,exports:module.exports,Request,Response,URL,Error,File,FormData,TextDecoder,Uint8Array,console,
      require(name){if(name==='server-only')return{};if(name.endsWith('class-server'))return server;if(name==='node:crypto')return require(name);if(name.startsWith('@/'))return load(name.slice(2)+'.ts');if(name.startsWith('.'))return load(resolve(dirname(full),name+'.ts'));throw new Error(name)},
    });cache.set(full,module.exports);return module.exports
  }
  return{calls,tables,load,db}
}
const request=body=>new Request('http://localhost/api/classroom',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({classId,...body})})
const lesson=extra=>({action:'save_lesson',courseSlug:'aqidah-1',title:'Lesson',summary:'Public',notes:'Private',published:false,...extra})

test('students, suspended accounts and signed-out requests cannot perform teaching mutations or uploads',async()=>{
  for(const options of [{role:'student'},{suspended:true},{signedOut:true}]) {
    const h=harness(options)
    for(const path of ['app/api/classroom/route.ts','app/api/classroom/materials/route.ts'])assert.equal((await h.load(path).POST(request(lesson()))).status,options.signedOut?401:403)
    assert.equal(h.calls.length,0)
  }
})
test('teacher cannot write a foreign class even if a class row is returned',async()=>{
  const h=harness({foreign:true})
  assert.equal((await h.load('app/api/classroom/route.ts').POST(request(lesson()))).status,403)
  assert.equal(h.calls.length,0)
})
test('lesson saves use canonical class-level curriculum and atomic notes RPC',async()=>{
  const h=harness(),post=h.load('app/api/classroom/route.ts').POST
  for(const bad of [{courseSlug:'aqidah-2'},{title:''},{published:'true'},{notes:'x'.repeat(8001)}])assert.equal((await post(request(lesson(bad)))).status,400)
  assert.equal(h.calls.length,0)
  assert.equal((await post(request(lesson({owner_id:'forged'})))).status,200)
  assert.equal(h.calls[0].args.classroom,classId);assert.equal(h.calls[0].args.description,'Public');assert.equal(h.calls[0].args.private_notes,'Private')
  assert.ok(!('owner_id' in h.calls[0].args))
})
test('invalid time ranges, unsafe links and malformed attendance cannot write',async()=>{
  const h=harness(),post=h.load('app/api/classroom/route.ts').POST
  assert.equal((await post(request({action:'save_session',lessonId,startsAt:'2026-09-16T18:00',endsAt:'2026-09-16T19:00',status:'scheduled'}))).status,400)
  assert.equal((await post(request({action:'save_session',lessonId,startsAt:'2026-09-16T18:00Z',endsAt:'2026-09-16T17:00Z',status:'scheduled'}))).status,400)
  for(const url of ['javascript:alert(1)','http://example.invalid','https://user:password@example.invalid'])assert.equal((await post(request({action:'add_link',lessonId,title:'Link',url}))).status,400)
  for(const records of [[],[{studentId,status:'unknown'}],[{studentId,status:'present'},{studentId,status:'late'}]])assert.equal((await post(request({action:'save_attendance',sessionId,records}))).status,400)
  assert.equal(h.calls.length,0)
})
test('future and cancelled sessions reject attendance; valid bulk writes ignore supplied identity snapshots',async()=>{
  for(const options of [{future:true},{cancelled:true}]) {
    const h=harness(options)
    assert.equal((await h.load('app/api/classroom/route.ts').POST(request({action:'save_attendance',sessionId,records:[{studentId,status:'present'}]}))).status,400)
    assert.equal(h.calls.length,0)
  }
  const h=harness()
  assert.equal((await h.load('app/api/classroom/route.ts').POST(request({action:'save_attendance',sessionId,records:[{studentId,status:'late',student_name:'Forged',marked_by:'Forged'}]}))).status,200)
  assert.deepEqual(Object.keys(h.calls[0].value[0]).sort(),['class_id','session_id','status','student_id'])
})
test('file signing requires an accessible material and expires in 60 seconds',async()=>{
  const missing=harness({role:'student'})
  assert.equal((await missing.load('app/api/classroom/materials/route.ts').GET(new Request('http://localhost/api/classroom/materials?id='+lessonId))).status,404)
  assert.equal(missing.calls.length,0)
  const found=harness({role:'student',material:true})
  assert.equal((await found.load('app/api/classroom/materials/route.ts').GET(new Request('http://localhost/api/classroom/materials?id='+lessonId))).status,200)
  assert.equal(found.calls[0].seconds,60)
})
test('class data pagination includes records beyond the default 1000-row limit',async()=>{
  const h=harness();h.tables.class_attendance=Array.from({length:1001},(_,n)=>({class_id:classId,student_id:String(n)}))
  const rows=await h.load('lib/classroom-server.ts').classRows(h.db,'class_attendance','*',classId,'marked_at')
  assert.equal(rows.length,1001);assert.equal(h.calls.filter(c=>c.action==='range').length,2)
})
test('student responses omit roster and teacher notes and reject another class selector',async()=>{
  const h=harness({role:'student'});h.tables.class_lesson_notes=[{class_id:classId,notes:'Secret notes'}]
  const route=h.load('app/api/classroom/route.ts')
  const response=await route.GET(new Request('http://localhost/api/classroom'))
  assert.equal(response.status,200)
  const result=await response.json();assert.deepEqual(result.notes,[]);assert.deepEqual(result.roster,[])
  assert.equal((await route.GET(new Request('http://localhost/api/classroom?classId='+studentId))).status,404)
})
test('Oslo scheduling accounts for DST and attendance calculations exclude excused absences',()=>{
  const h=harness(),model=h.load('lib/classroom.ts')
  assert.equal(model.osloToIso('2026-09-16T18:00'),'2026-09-16T16:00:00.000Z')
  assert.equal(model.osloToIso('2026-12-16T18:00'),'2026-12-16T17:00:00.000Z')
  assert.throws(()=>model.osloToIso('2026-03-29T02:30'))
  assert.throws(()=>model.osloToIso('2026-10-25T02:30'))
  assert.equal(model.attendanceSummary([{status:'present'},{status:'late'},{status:'absent'},{status:'excused'}]).percent,67)
  assert.equal(model.attendanceSummary([{status:'excused'}]).percent,null)
})
