'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { CATALOG } from '@/lib/curriculum'
import { ATTENDANCE_LABELS, attendanceSummary, displayTime, osloInput, osloToIso, type Announcement, type AttendanceStatus, type ClassroomData, type ClassSession, type Lesson, type Material } from '@/lib/classroom'
import styles from './Classroom.module.css'

type Tab = 'oversikt' | 'leksjoner' | 'timeplan' | 'oppmote' | 'kunngjoringer'
type Save = (body: Record<string,unknown>) => Promise<boolean>
const tabs: [Tab,string][] = [['oversikt','Oversikt'],['leksjoner','Leksjoner'],['timeplan','Timeplan'],['oppmote','Oppmøte'],['kunngjoringer','Kunngjøringer']]
async function api(url: string, body?: object, method = 'POST') {
  const response = await fetch(url,{ cache:'no-store', ...(body ? {method,headers:{'Content-Type':'application/json'},body:JSON.stringify(body)} : {}) })
  const result = await response.json()
  if (!response.ok) throw new Error(result.error || 'Kunne ikke fullføre. Prøv igjen.')
  return result
}

export default function ClassroomWorkspace({ initialTab = 'oversikt', admin = false }: { initialTab?: Tab; admin?: boolean }) {
  const [data,setData] = useState<ClassroomData | null>(null)
  const [loading,setLoading] = useState(true)
  const [error,setError] = useState('')
  const [success,setSuccess] = useState('')
  const [busy,setBusy] = useState(false)
  const lock = useRef(false)
  const loadVersion = useRef(0)
  const [tab,setTab] = useState<Tab>(initialTab)
  const [lessonId,setLessonId] = useState<string | null>(null)
  const [editing,setEditing] = useState(false)

  async function load(classId?: string) {
    const version = ++loadVersion.current
    setLoading(true); setError('')
    try { const result = await api('/api/classroom'+(classId?'?classId='+encodeURIComponent(classId):'')); if(version===loadVersion.current) setData(result) }
    catch(e) { if(version===loadVersion.current) setError(e instanceof Error?e.message:'Kunne ikke hente klasserommet.') }
    finally { if(version===loadVersion.current) setLoading(false) }
  }
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const requestedTab = params.get('tab') as Tab
    if(tabs.some(([key])=>key===requestedTab)) setTab(requestedTab)
    if(params.get('lessonId')) { setLessonId(params.get('lessonId')); setTab('leksjoner') }
    void load(params.get('classId')||undefined)
  },[])

  const save: Save = async body => {
    if(lock.current || !data?.classroom) return false
    lock.current=true; setBusy(true); setError(''); setSuccess('')
    try {
      await api('/api/classroom',{...body,classId:data.classroom.id})
      await load(data.classroom.id); setSuccess('Endringen er lagret.'); return true
    } catch(e) { setError(e instanceof Error?e.message:'Kunne ikke lagre.'); return false }
    finally { lock.current=false; setBusy(false) }
  }
  function navigate(next: Tab) { setTab(next); setEditing(false); setError(''); setSuccess('') }
  const lesson = data?.lessons.find(l=>l.id===lessonId)
  const nextSession = data?.sessions.filter(s=>s.status==='scheduled'&&Date.parse(s.ends_at)>Date.now()).sort((a,b)=>a.starts_at.localeCompare(b.starts_at))[0]

  return <><div className="global-fixed-bg"/><main className={styles.page}>
    <Link href={admin?'/portal/admin/klasse':'/portal'} className={styles.back}>← {admin?'Klasseadministrasjon':'Portal'}</Link>
    <header className={styles.header}><p className={styles.eyebrow}>{data?.canManage?'Undervisning':'Min klasse'}</p><h1 dir="auto">{data?.classroom?.name || 'Klasserom'}</h1>
      {data?.classroom && <p className={styles.muted}>Nivå {data.classroom.level} · {data.teacherName}</p>}
    </header>
    {error && <p className={styles.error} role="alert">{error}</p>}{success && <p className={styles.success} role="status">{success}</p>}
    {loading && <p role="status" className={styles.muted}>Henter klasserommet…</p>}
    {!loading && !data && <button className={styles.button} onClick={()=>load()}>Prøv igjen</button>}
    {data?.classroom && <>
      <div className={styles.toolbar}>
        <div><label className={styles.fieldLabel} htmlFor="workspace-class">Klasse</label><select className={styles.select} id="workspace-class" value={data.classroom.id} disabled={busy||loading} onChange={e=>{setLessonId(null);setEditing(false);setSuccess('');void load(e.target.value)}}>{data.classrooms.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
        {data.canManage && <Link className={styles.secondary} href={`/portal/admin/klasse?classId=${data.classroom.id}`}>Administrer elever</Link>}
      </div>
      <nav className={styles.tabs} aria-label="Klasserom">{tabs.map(([key,label])=><button key={key} aria-pressed={tab===key} onClick={()=>navigate(key)} disabled={busy||loading}>{label}</button>)}</nav>
      <div key={data.classroom.id} aria-busy={busy||loading}>
      {tab==='oversikt' && <div className={styles.grid}>
        <section className={styles.panel}><p className={styles.eyebrow}>Neste undervisning</p>{nextSession ? <><h2>{data.lessons.find(l=>l.id===nextSession.lesson_id)?.title || 'Undervisning'}</h2><p>{displayTime(nextSession.starts_at)}</p><p className={styles.muted}>Alle klokkeslett er norsk tid.</p><button className={styles.button} onClick={()=>{setLessonId(nextSession.lesson_id);navigate('leksjoner')}}>Åpne leksjon</button></> : <><h2>Ingen kommende undervisning</h2><p className={styles.muted}>{data.canManage?'Opprett en leksjon og legg den i timeplanen.':'Læreren publiserer neste undervisning her.'}</p><button className={styles.secondary} onClick={()=>navigate(data.canManage?'leksjoner':'timeplan')}>{data.canManage?'Planlegg undervisning':'Se timeplan'}</button></>}</section>
        <section className={styles.panel}><h2>Siste kunngjøring</h2>{data.announcements.find(a=>a.published) ? <><h3>{data.announcements.find(a=>a.published)!.title}</h3><p className={styles.prose}>{data.announcements.find(a=>a.published)!.message}</p></> : <p className={styles.empty}>Ingen publiserte kunngjøringer ennå.</p>}<button className={styles.secondary} onClick={()=>navigate('kunngjoringer')}>Alle kunngjøringer</button></section>
        <section className={styles.panel}><h2>Leksjoner</h2><p className={styles.muted}>{data.lessons.filter(l=>l.published).length} publiserte leksjoner{data.canManage?` · ${data.lessons.filter(l=>!l.published).length} utkast`:''}</p><button className={styles.secondary} onClick={()=>navigate('leksjoner')}>Se leksjoner og materiell</button></section>
        <section className={styles.panel}><h2>{data.canManage?'Oppmøte i klassen':'Mitt oppmøte'}</h2><p className={styles.muted}>{data.canManage?`${data.roster.length} elever i klassen. Registrer oppmøte etter at undervisningen har startet.`:'Se dine registreringer og oppmøtehistorikk.'}</p><button className={styles.secondary} onClick={()=>navigate('oppmote')}>Åpne oppmøte</button></section>
      </div>}
      {tab==='leksjoner' && <>
        <div className={styles.toolbar}><h2>Leksjoner og materiell</h2>{data.canManage && <button className={styles.button} disabled={busy||loading} onClick={()=>{setLessonId(null);setEditing(true)}}>Ny leksjon</button>}</div>
        {editing && data.canManage ? <LessonEditor key={lesson?.id||'new'} lesson={lesson} data={data} save={save} busy={busy} close={()=>setEditing(false)}/> : lesson ? <section className={styles.panel}>
          <div className={styles.toolbar}><button className={styles.secondary} disabled={busy} onClick={()=>setLessonId(null)}>← Alle leksjoner</button>{data.canManage && <button className={styles.button} disabled={busy} onClick={()=>setEditing(true)}>Rediger leksjon</button>}</div>
          <p className={styles.eyebrow}>{CATALOG.find(c=>c.slug===lesson.course_slug)?.name}{!lesson.published?' · Utkast':''}</p><h2>{lesson.title}</h2><p className={styles.prose}>{lesson.summary}</p>
          {(lesson.book_pages||lesson.book_questions) && <p className={styles.muted}>{CATALOG.find(c=>c.slug===lesson.course_slug)?.book?.title || 'Pensum'}{lesson.book_pages?` · Sider ${lesson.book_pages}`:''}{lesson.book_questions?` · Spørsmål ${lesson.book_questions}`:''}</p>}
          <Materials data={data} lesson={lesson} save={save} busy={busy} onBusy={value=>{lock.current=value;setBusy(value)}} reload={()=>load(data.classroom!.id)}/>
          {data.canManage && <details className={styles.details}><summary>Private lærernotater</summary><p className={styles.prose}>{data.notes.find(n=>n.lesson_id===lesson.id)?.notes || 'Ingen private notater.'}</p></details>}
        </section> : <div className={styles.cards}>{data.lessons.map(l=><section className={styles.panel} key={l.id}><span className={styles.badge}>{l.published?'Publisert':'Utkast'}</span><p className={styles.eyebrow}>{CATALOG.find(c=>c.slug===l.course_slug)?.name}</p><h3>{l.title}</h3><p className={styles.muted}>{data.materials.filter(m=>m.lesson_id===l.id).length} ressurser</p><button className={styles.secondary} onClick={()=>setLessonId(l.id)}>Åpne leksjon</button></section>)}{!data.lessons.length && <p className={styles.empty}>Ingen leksjoner ennå. {data.canManage?'Opprett den første leksjonen for klassen.':'Publiserte leksjoner vises her.'}</p>}</div>}
      </>}
      {tab==='timeplan' && <Schedule data={data} save={save} busy={busy} openLesson={id=>{setLessonId(id);navigate('leksjoner')}}/>}
      {tab==='oppmote' && <AttendancePanel data={data} save={save} busy={busy}/>}
      {tab==='kunngjoringer' && <Announcements data={data} save={save} busy={busy}/>}
      </div>
    </>}
    {!loading && data && !data.classroom && <section className={styles.panel}><h2>Ingen klasse ennå</h2><p className={styles.muted}>Ta kontakt med din ustadh for å bli lagt til i en klasse.</p>{admin && <Link href="/portal/admin/klasse" className={styles.button}>Opprett klasse</Link>}</section>}
  </main></>
}

function LessonEditor({ lesson,data,save,busy,close }: { lesson?:Lesson; data:ClassroomData; save:Save; busy:boolean; close:()=>void }) {
  async function submit(e:FormEvent<HTMLFormElement>) {
    e.preventDefault();const fields=new FormData(e.currentTarget)
    if(await save({action:'save_lesson',id:lesson?.id,...Object.fromEntries(fields),published:fields.get('published')==='on'})) close()
  }
  return <section className={styles.panel}><h2>{lesson?'Rediger leksjon':'Ny leksjon'}</h2><form className={styles.form} onSubmit={submit}><fieldset disabled={busy}>
    <label htmlFor="lesson-course">Fag</label><select id="lesson-course" name="courseSlug" defaultValue={lesson?.course_slug} required>{CATALOG.filter(c=>c.levelNumber===data.classroom!.level).map(c=><option key={c.slug} value={c.slug}>{c.name}</option>)}</select>
    <label htmlFor="lesson-title">Tittel</label><input id="lesson-title" name="title" defaultValue={lesson?.title} required maxLength={160}/>
    <label htmlFor="lesson-summary">Beskrivelse og læringsmål</label><textarea id="lesson-summary" name="summary" defaultValue={lesson?.summary} maxLength={4000}/>
    <div className={styles.two}><div><label htmlFor="lesson-pages">Boksider</label><input id="lesson-pages" name="bookPages" placeholder="For eksempel 12–16" defaultValue={lesson?.book_pages} maxLength={120}/></div><div><label htmlFor="lesson-questions">Spørsmål i boken</label><input id="lesson-questions" name="bookQuestions" placeholder="For eksempel 1–5" defaultValue={lesson?.book_questions} maxLength={120}/></div></div>
    <label htmlFor="lesson-notes">Private lærernotater</label><textarea id="lesson-notes" name="notes" defaultValue={data.notes.find(n=>n.lesson_id===lesson?.id)?.notes} maxLength={8000}/><p className={styles.muted}>Bare klassens lærer og administrator kan lese disse notatene.</p>
    <label><input type="checkbox" name="published" defaultChecked={lesson?.published}/>Publiser for elevene</label><p className={styles.muted}>Utkast, tilhørende timeplan og materiell er skjult for elevene.</p>
    <div className={styles.actions}><button className={styles.button}>{busy?'Lagrer…':'Lagre leksjon'}</button><button type="button" className={styles.secondary} onClick={close}>Avbryt</button></div>
  </fieldset></form></section>
}

function Materials({data,lesson,save,busy,reload,onBusy}:{data:ClassroomData;lesson:Lesson;save:Save;busy:boolean;reload:()=>Promise<void>;onBusy:(value:boolean)=>void}) {
  const [working,setWorking]=useState(false),[error,setError]=useState('')
  async function open(material:Material) {
    const tab=window.open('about:blank','_blank'); if(tab) tab.opener=null
    setError('')
    try { const result=await api(`/api/classroom/materials?id=${material.id}`); if(tab) tab.location.href=result.url; else window.location.assign(result.url) }
    catch(e) {tab?.close();setError(e instanceof Error?e.message:'Kunne ikke åpne materiellet.')}
  }
  async function upload(e:FormEvent<HTMLFormElement>) {
    e.preventDefault();const form=e.currentTarget;const body=new FormData(form);body.set('classId',data.classroom!.id);body.set('lessonId',lesson.id)
    setWorking(true);onBusy(true);setError('')
    try {const r=await fetch('/api/classroom/materials',{method:'POST',body});const result=await r.json();if(!r.ok)throw new Error(result.error);form.reset();await reload()}
    catch(e){setError(e instanceof Error?e.message:'Kunne ikke laste opp.')}
    finally{setWorking(false);onBusy(false)}
  }
  async function remove(material:Material) {
    if(window.prompt(`Skriv slett for å fjerne «${material.title}».`)?.trim()!=='slett')return
    setWorking(true);onBusy(true);setError('')
    try{await api('/api/classroom/materials',{id:material.id,classId:data.classroom!.id,confirmation:'slett'},'DELETE');await reload()}
    catch(e){setError(e instanceof Error?e.message:'Kunne ikke slette.')}
    finally{setWorking(false);onBusy(false)}
  }
  return <><h3>Materiell</h3>{error&&<p className={styles.error} role="alert">{error}</p>}
    {data.materials.filter(m=>m.lesson_id===lesson.id).map(m=><div className={styles.row} key={m.id}><div><strong>{m.title}</strong><p className={styles.muted}>{m.storage_path?'PDF':'Ekstern lenke'}</p></div><div className={styles.actions}><button className={styles.secondary} onClick={()=>open(m)}>Åpne</button>{data.canManage&&<button className={styles.danger} disabled={working||busy} onClick={()=>remove(m)}>Fjern</button>}</div></div>)}
    {!data.materials.some(m=>m.lesson_id===lesson.id)&&<p className={styles.empty}>Ingen ressurser lagt til ennå.</p>}
    {data.canManage&&<details className={styles.details}><summary>Legg til materiell</summary><div className={styles.two}>
      <form className={styles.form} onSubmit={upload}><fieldset disabled={busy||working}><label htmlFor="pdf-title">Tittel på PDF</label><input id="pdf-title" name="title" maxLength={160} required/><label htmlFor="pdf-file">PDF-fil (maks 10 MB)</label><input id="pdf-file" name="file" type="file" accept="application/pdf,.pdf" required/><button className={styles.button}>{working?'Laster opp…':'Last opp PDF'}</button></fieldset></form>
      <form className={styles.form} onSubmit={async e=>{e.preventDefault();const form=e.currentTarget;if(await save({action:'add_link',lessonId:lesson.id,...Object.fromEntries(new FormData(form))}))form.reset()}}><fieldset disabled={busy||working}><label htmlFor="link-title">Tittel på lenke</label><input id="link-title" name="title" maxLength={160} required/><label htmlFor="link-url">HTTPS-lenke</label><input id="link-url" name="url" type="url" placeholder="https://" maxLength={2000} required/><button className={styles.button}>Legg til lenke</button></fieldset></form>
    </div></details>}
  </>
}

function weekStart(offset:number) {
  const day=new Date(osloInput(new Date().toISOString()).slice(0,10)+'T12:00:00Z')
  day.setUTCDate(day.getUTCDate()-((day.getUTCDay()+6)%7)+offset*7)
  return day.toISOString().slice(0,10)
}
function Schedule({data,save,busy,openLesson}:{data:ClassroomData;save:Save;busy:boolean;openLesson:(id:string)=>void}) {
  const [week,setWeek]=useState(0),[edit,setEdit]=useState<ClassSession|null|undefined>(undefined),[error,setError]=useState('')
  const start=weekStart(week),endDate=new Date(start+'T12:00:00Z');endDate.setUTCDate(endDate.getUTCDate()+7)
  const lower=Date.parse(osloToIso(start+'T00:00')),upper=Date.parse(osloToIso(endDate.toISOString().slice(0,10)+'T00:00'))
  const sessions=data.sessions.filter(s=>Date.parse(s.starts_at)>=lower&&Date.parse(s.starts_at)<upper)
  return <><div className={styles.toolbar}><h2>Timeplan</h2>{data.canManage&&<button className={styles.button} onClick={()=>setEdit(null)} disabled={!data.lessons.length||busy}>Planlegg undervisning</button>}</div>
    <p className={styles.muted}>Alle klokkeslett vises i norsk tid (Europe/Oslo). {data.canManage&&!data.lessons.length?'Opprett en leksjon først.':''}</p>
    {edit!==undefined&&<section className={styles.panel}><h3>{edit?'Rediger undervisning':'Ny undervisning'}</h3>{error&&<p role="alert" className={styles.error}>{error}</p>}
      <form key={edit?.id||'new'} className={styles.form} onSubmit={async e=>{e.preventDefault();setError('');const f=new FormData(e.currentTarget);try{if(await save({action:'save_session',id:edit?.id,lessonId:f.get('lessonId'),startsAt:osloToIso(String(f.get('startsAt'))),endsAt:osloToIso(String(f.get('endsAt'))),status:f.get('status')}))setEdit(undefined)}catch(e){setError(e instanceof Error?e.message:'Ugyldig tidspunkt.')}}}><fieldset disabled={busy}>
      <label htmlFor="session-lesson">Leksjon</label><select id="session-lesson" name="lessonId" defaultValue={edit?.lesson_id} required>{data.lessons.map(l=><option key={l.id} value={l.id}>{l.title}{l.published?'':' (utkast)'}</option>)}</select>
      <div className={styles.two}><div><label htmlFor="session-start">Start, norsk tid</label><input id="session-start" name="startsAt" type="datetime-local" defaultValue={edit?osloInput(edit.starts_at):''} required/></div><div><label htmlFor="session-end">Slutt, norsk tid</label><input id="session-end" name="endsAt" type="datetime-local" defaultValue={edit?osloInput(edit.ends_at):''} required/></div></div>
      <label htmlFor="session-status">Status</label><select id="session-status" name="status" defaultValue={edit?.status||'scheduled'}><option value="scheduled">Planlagt</option><option value="completed">Gjennomført</option><option value="cancelled">Avlyst</option></select>
      <p className={styles.muted}>En time med registrert oppmøte kan ikke flyttes. Opprett en ny time ved behov.</p><div className={styles.actions}><button className={styles.button}>Lagre undervisning</button><button type="button" className={styles.secondary} onClick={()=>setEdit(undefined)}>Avbryt</button></div></fieldset></form>
    </section>}
    <section className={styles.panel}><div className={styles.toolbar}><h3>Uken fra {new Intl.DateTimeFormat('nb-NO',{dateStyle:'long',timeZone:'Europe/Oslo'}).format(new Date(lower))}</h3><div className={styles.actions}><button className={styles.secondary} onClick={()=>setWeek(w=>w-1)} aria-label="Forrige uke">←</button><button className={styles.secondary} onClick={()=>setWeek(0)}>Denne uken</button><button className={styles.secondary} onClick={()=>setWeek(w=>w+1)} aria-label="Neste uke">→</button></div></div>
      {sessions.map(s=><div className={styles.row} key={s.id}><div><span className={styles.badge}>{s.status==='cancelled'?'Avlyst':s.status==='completed'?'Gjennomført':'Planlagt'}</span><h3>{data.lessons.find(l=>l.id===s.lesson_id)?.title||'Undervisning'}</h3><p className={styles.muted}>{displayTime(s.starts_at)} – {osloInput(s.ends_at).slice(11)}</p></div><div className={styles.actions}><button className={styles.secondary} onClick={()=>openLesson(s.lesson_id)}>Leksjon</button>{data.canManage&&<button className={styles.secondary} disabled={busy} onClick={()=>{setEdit(s);setError('')}}>Rediger</button>}</div></div>)}
      {!sessions.length&&<p className={styles.empty}>Ingen undervisning denne uken.</p>}
    </section>
  </>
}

function AttendancePanel({data,save,busy}:{data:ClassroomData;save:Save;busy:boolean}) {
  const eligible=data.sessions.filter(s=>s.status!=='cancelled'&&Date.parse(s.starts_at)<=Date.now()).sort((a,b)=>b.starts_at.localeCompare(a.starts_at))
  const [selected,setSelected]=useState(eligible[0]?.id||'')
  const [changes,setChanges]=useState<Record<string,AttendanceStatus|''>>({})
  const activeRows=data.attendance.filter(a=>data.sessions.some(s=>s.id===a.session_id&&s.status!=='cancelled'))
  const counts=attendanceSummary(activeRows)
  const current=data.attendance.filter(a=>a.session_id===selected)
  const status=(id:string)=>changes[id]??current.find(a=>a.student_id===id)?.status??''
  return <section className={styles.panel}><h2>{data.canManage?'Registrer oppmøte':'Mitt oppmøte'}</h2>
    {!data.canManage ? <><div className={styles.stats}>{Object.entries(ATTENDANCE_LABELS).map(([key,label])=><div key={key}><strong>{counts[key as AttendanceStatus]}</strong><span>{label}</span></div>)}</div><p className={styles.muted}>{counts.percent===null?'Ingen beregnet oppmøteprosent ennå.':`Oppmøte: ${counts.percent} %. Til stede og forsinket teller som oppmøte; gyldig fravær og avlyste timer holdes utenfor.`}</p>
      {activeRows.map(a=><div className={styles.row} key={a.session_id}><div><strong>{data.lessons.find(l=>l.id===data.sessions.find(s=>s.id===a.session_id)?.lesson_id)?.title||'Undervisning'}</strong><p className={styles.muted}>{data.sessions.find(s=>s.id===a.session_id)?displayTime(data.sessions.find(s=>s.id===a.session_id)!.starts_at):'Tidligere undervisning'}</p></div><span className={styles.badge}>{ATTENDANCE_LABELS[a.status]}</span></div>)}{!activeRows.length&&<p className={styles.empty}>Læreren har ikke registrert oppmøte ennå.</p>}
    </> : <>
      <label htmlFor="attendance-session" className={styles.fieldLabel}>Undervisning</label><select id="attendance-session" className={styles.select} value={selected} disabled={busy} onChange={e=>{setSelected(e.target.value);setChanges({})}}><option value="">Velg undervisning</option>{eligible.map(s=><option key={s.id} value={s.id}>{displayTime(s.starts_at)} · {data.lessons.find(l=>l.id===s.lesson_id)?.title}</option>)}</select>
      <p className={styles.muted}>Bare påbegynt undervisning kan registreres. Tomme felt betyr «ikke registrert», ikke fravær.</p>
      {selected&&<><button className={styles.secondary} disabled={busy} onClick={()=>setChanges(Object.fromEntries(data.roster.map(s=>[s.user_id,'present'])))}>Marker alle til stede</button>
      <form onSubmit={async e=>{e.preventDefault();const records=data.roster.map(s=>({studentId:s.user_id,status:status(s.user_id)})).filter(r=>r.status);if(await save({action:'save_attendance',sessionId:selected,records}))setChanges({})}}><div className={styles.tableWrap}><table className={styles.table}><thead><tr><th>Elev</th><th>Status</th></tr></thead><tbody>{data.roster.map(s=><tr key={s.user_id}><td><bdi>{s.full_name}</bdi></td><td><select className={styles.select} aria-label={`Oppmøte for ${s.full_name}`} disabled={busy} value={status(s.user_id)} onChange={e=>setChanges(c=>({...c,[s.user_id]:e.target.value as AttendanceStatus|''}))}><option value="" disabled={!!current.find(a=>a.student_id===s.user_id)}>Ikke registrert</option>{Object.entries(ATTENDANCE_LABELS).map(([k,label])=><option key={k} value={k}>{label}</option>)}</select></td></tr>)}</tbody></table></div><button className={styles.button} style={{marginTop:20}} disabled={busy||!data.roster.some(s=>status(s.user_id))}>{busy?'Lagrer…':'Lagre oppmøte'}</button></form>
      {current.filter(a=>!data.roster.some(s=>s.user_id===a.student_id)).map(a=><p key={a.student_id} className={styles.muted}>{a.student_name} (tidligere elev): {ATTENDANCE_LABELS[a.status]}</p>)}
      </>}
      {!eligible.length&&<p className={styles.empty}>Ingen påbegynt undervisning ennå. Legg undervisningen i timeplanen først.</p>}
      <details className={styles.details}><summary>Oppmøtehistorikk per elev</summary><div className={styles.tableWrap}><table className={styles.table}><thead><tr><th>Elev</th>{Object.values(ATTENDANCE_LABELS).map(l=><th key={l}>{l}</th>)}</tr></thead><tbody>{data.roster.map(s=>{const c=attendanceSummary(activeRows.filter(a=>a.student_id===s.user_id));return <tr key={s.user_id}><td>{s.full_name}</td><td>{c.present}</td><td>{c.late}</td><td>{c.absent}</td><td>{c.excused}</td></tr>})}</tbody></table></div></details>
    </>}
  </section>
}

function Announcements({data,save,busy}:{data:ClassroomData;save:Save;busy:boolean}) {
  const [edit,setEdit]=useState<Announcement|null|undefined>(undefined)
  return <><div className={styles.toolbar}><h2>Kunngjøringer</h2>{data.canManage&&<button className={styles.button} disabled={busy} onClick={()=>setEdit(null)}>Ny kunngjøring</button>}</div>
    {edit!==undefined&&<section className={styles.panel}><form key={edit?.id||'new'} className={styles.form} onSubmit={async e=>{e.preventDefault();const f=new FormData(e.currentTarget);if(await save({action:'save_announcement',id:edit?.id,title:f.get('title'),message:f.get('message'),published:f.get('published')==='on'}))setEdit(undefined)}}><fieldset disabled={busy}>
      <label htmlFor="announcement-title">Tittel</label><input id="announcement-title" name="title" maxLength={160} defaultValue={edit?.title} required/>
      <label htmlFor="announcement-message">Melding til klassen</label><textarea id="announcement-message" name="message" maxLength={4000} defaultValue={edit?.message} required/>
      <label><input name="published" type="checkbox" defaultChecked={edit?.published}/>Publiser for denne klassen</label><div className={styles.actions}><button className={styles.button}>Lagre kunngjøring</button><button type="button" className={styles.secondary} onClick={()=>setEdit(undefined)}>Avbryt</button></div>
    </fieldset></form></section>}
    {data.announcements.map(a=><article className={styles.panel} key={a.id}><p className={styles.eyebrow}>{displayTime(a.created_at)}{!a.published?' · Utkast':''}</p><h3>{a.title}</h3><p className={styles.prose}>{a.message}</p>{data.canManage&&<div className={styles.actions}><button className={styles.secondary} disabled={busy} onClick={()=>setEdit(a)}>Rediger</button><button className={styles.danger} disabled={busy} onClick={()=>{if(window.prompt('Skriv slett for å fjerne kunngjøringen.')?.trim()==='slett')void save({action:'delete_announcement',id:a.id,confirmation:'slett'})}}>Slett</button></div>}</article>)}
    {!data.announcements.length&&<p className={styles.empty}>Ingen kunngjøringer ennå.</p>}
  </>
}
