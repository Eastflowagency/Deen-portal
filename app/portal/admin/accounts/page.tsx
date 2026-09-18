'use client'

import { useEffect, useState, type FormEvent } from 'react'
import Link from 'next/link'
import styles from '../klasse/Klasse.module.css'

type User = { id: string; name: string; identifier: string; role: string; status: string; classroom?: { name: string; level: number } }
type Overview = { users: User[]; classes: { id: string; name: string; owner_id: string; level: number }[]; teachers: { id: string; name: string; status: string }[]; hasNext: boolean }

export default function AccountsPage() {
  const [data, setData] = useState<Overview | null>(null)
  const [page, setPage] = useState(1)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  async function load() {
    const response = await fetch(`/api/admin/accounts?page=${page}`, { cache: 'no-store' })
    const result = await response.json()
    if (!response.ok) throw new Error(result.error)
    setData(result)
  }
  useEffect(() => { load().catch(e => setError(e.message)) }, [page]) // eslint-disable-line react-hooks/exhaustive-deps
  async function act(body: object, form?: HTMLFormElement) {
    if (busy) return
    setBusy(true); setError(''); setNotice('')
    try {
      const response = await fetch('/api/admin/accounts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error)
      form?.reset(); setNotice('Endringen er lagret.'); await load()
    } catch (e) { setError(e instanceof Error ? e.message : 'Kunne ikke lagre.') }
    finally { setBusy(false) }
  }
  function submit(event: FormEvent<HTMLFormElement>, action: string, extra = {}) {
    event.preventDefault()
    const form = event.currentTarget
    void act({ ...Object.fromEntries(new FormData(form)), action, ...extra }, form)
  }
  const teachers = data?.teachers.filter(t => t.status === 'active') ?? []
  const teacherOptions = teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)
  return <><div className="global-fixed-bg" /><header className={styles.adminNav}><Link className={styles.adminBack} href="/portal/admin">← Admin</Link></header>
    <main className={`${styles.page} ${styles.adminPage}`}>
      <header className={styles.header}><p>Administrasjon</p><h1>Brukere og klasser</h1><span>Administrer lærere, klassetilhørighet og medlemskap.</span></header>
      {error && <p role="alert" className={styles.error}>{error}</p>}{notice && <p role="status" className={styles.success}>{notice}</p>}
      {!data ? <button className={styles.button} onClick={() => load().catch(e => setError(e.message))}>Hent brukere</button> : <>
      <div className={styles.columns}>
        <section className={styles.panel}><h2>Ny lærer</h2><form className={styles.form} onSubmit={e => submit(e, 'create_teacher')}><fieldset disabled={busy}>
          <label htmlFor="teacher-name">Fullt navn</label><input id="teacher-name" name="name" required maxLength={120} />
          <label htmlFor="teacher-email">E-post</label><input id="teacher-email" name="email" type="email" required />
          <label htmlFor="teacher-password">Passord</label><input id="teacher-password" name="password" type="password" autoComplete="new-password" minLength={12} maxLength={128} required />
          <p className={styles.hint}>Gi passordet direkte til læreren. Det kan ikke hentes frem senere.</p><button className={styles.button}>Opprett lærer</button>
        </fieldset></form></section>
        <section className={styles.panel}><h2>Ny klasse</h2><form className={styles.form} onSubmit={e => submit(e, 'create_class')}><fieldset disabled={busy}>
          <label htmlFor="class-name">Klassenavn</label><input id="class-name" name="name" dir="auto" required maxLength={120} />
          <label htmlFor="class-teacher">Ansvarlig lærer</label><select id="class-teacher" name="teacherId" required><option value="">Velg lærer</option>{teacherOptions}</select>
          <label htmlFor="class-level">Nivå</label><select id="class-level" name="level">{[1,2,3].map(n => <option key={n} value={n}>Nivå {n}</option>)}</select><button className={styles.button}>Opprett klasse</button>
        </fieldset></form></section>
      </div>
      <section className={styles.panel} style={{ marginTop: 24 }}><h2>Klasser</h2><p className={styles.muted}>Når du bytter lærer, følger alle elevene med til den nye læreren.</p>
        {data.classes.map(c => <form key={`${c.id}-${c.owner_id}`} className={styles.form} onSubmit={e => { e.preventDefault(); if (window.confirm(`Bytt ansvarlig lærer for ${c.name}, inkludert alle elevene?`)) submit(e, 'assign_class', { classId: c.id }) }}>
          <label htmlFor={`teacher-${c.id}`}><bdi>{c.name}</bdi> · Nivå {c.level}</label><select id={`teacher-${c.id}`} name="teacherId" defaultValue={c.owner_id} disabled={busy} required>{data.teachers.map(t => <option key={t.id} value={t.id} disabled={t.status !== 'active'}>{t.name}{t.status !== 'active' ? ' (på pause)' : ''}</option>)}</select><button disabled={busy} className={styles.button}>Bytt lærer</button>
        </form>)}{!data.classes.length && <p>Ingen klasser ennå.</p>}
      </section>
      <section className={styles.panel} style={{ marginTop: 24 }}><h2>Brukere</h2>
        {data.users.map(u => <article key={u.id} style={{ borderTop: '1px solid #334155', padding: '24px 0' }}><h3 dir="auto">{u.name}</h3><p className={styles.muted}>{u.identifier} · {u.role === 'admin' ? 'Administrator' : u.role === 'teacher' ? 'Lærer' : 'Elev'} · {u.status === 'active' ? 'Aktiv' : 'På pause'}</p>
          {u.classroom && <p className={styles.muted}><bdi>{u.classroom.name}</bdi> · Nivå {u.classroom.level}</p>}
          {u.role !== 'admin' && <><div className={styles.studentActions}>
            <button disabled={busy} className={styles.button} onClick={() => { if(window.confirm(`Endre medlemskapet til ${u.name}?`)) void act({ action: 'set_status', userId: u.id, value: u.status === 'active' ? 'suspended' : 'active' }) }}>{u.status === 'active' ? 'Sett på pause' : 'Aktiver medlemskap'}</button>
            <button disabled={busy} className={styles.moveButton} onClick={() => { if(window.confirm(`Endre rollen til ${u.name} til ${u.role === 'student' ? 'lærer' : 'elev'}?`)) void act({ action: 'set_role', userId: u.id, value: u.role === 'student' ? 'teacher' : 'student' }) }}>{u.role === 'student' ? 'Gjør til lærer' : 'Gjør til elev'}</button>
          </div>{u.role === 'student' && <details><summary>Endre elevens passord</summary><form className={styles.form} onSubmit={e => submit(e, 'reset_password', { userId: u.id })}><label htmlFor={`password-${u.id}`}>Nytt passord (minst 12 tegn)</label><input id={`password-${u.id}`} name="password" type="password" autoComplete="new-password" required minLength={12} maxLength={128} disabled={busy} /><button className={styles.button} disabled={busy}>Lagre nytt passord</button></form></details>}</>}
        </article>)}
        <div className={styles.studentActions}><button className={styles.button} disabled={busy || page === 1} onClick={() => setPage(p => p-1)}>Forrige</button><span>Side {page}</span><button className={styles.button} disabled={busy || !data.hasNext} onClick={() => setPage(p => p+1)}>Neste</button></div>
      </section></>}
    </main></>
}
