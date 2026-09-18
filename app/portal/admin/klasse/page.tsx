'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import Link from 'next/link'
import styles from './Klasse.module.css'

type Student = { user_id: string; username: string; full_name: string; created_at: string }
type Destination = { id: string; name: string }
type ClassOverview = {
  classrooms: { id: string; name: string }[]
  classroom: { id: string; name: string } | null
  students: Student[]
  canCreateStudents: boolean
}

async function classRequest(url: string, body?: object, method?: 'DELETE') {
  const response = await fetch(url, {
    method: method ?? (body ? 'POST' : 'GET'), cache: 'no-store',
    ...(body ? { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) } : {}),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.error || 'Kunne ikke fullføre. Prøv igjen.')
  return data
}

export default function KlasseAdminPage() {
  const [overview, setOverview] = useState<ClassOverview | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [removing, setRemoving] = useState(false)
  const [pendingRemoval, setPendingRemoval] = useState<string | null>(null)
  const [confirmation, setConfirmation] = useState('')
  const [pendingMove, setPendingMove] = useState<string | null>(null)
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [destinationsLoading, setDestinationsLoading] = useState(false)
  const [destinationId, setDestinationId] = useState('')
  const [moving, setMoving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [name, setName] = useState('')
  const [level, setLevel] = useState(1)
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const savingRef = useRef(false)
  const nameInput = useRef<HTMLInputElement>(null)

  async function load(classId?: string) {
    setLoading(true)
    setError('')
    try { setOverview(await classRequest('/api/klasse' + (classId ? '?classId=' + encodeURIComponent(classId) : ''))) }
    catch (error) { setError(error instanceof Error ? error.message : 'Kunne ikke hente klassen.') }
    finally { setLoading(false) }
  }

  useEffect(() => { void load(new URLSearchParams(window.location.search).get('classId') || undefined) }, [])

  async function openMove(student: Student) {
    setPendingRemoval(null)
    setPendingMove(student.user_id)
    setDestinationId('')
    setDestinations([])
    setDestinationsLoading(true)
    setError('')
    setSuccess('')
    try { setDestinations((await classRequest('/api/klasse/destinations')).destinations.filter((item: Destination) => item.id !== overview?.classroom?.id)) }
    catch (error) { setError(error instanceof Error ? error.message : 'Kunne ikke hente klassene.') }
    finally { setDestinationsLoading(false) }
  }

  async function moveStudent(event: FormEvent, student: Student) {
    event.preventDefault()
    if (savingRef.current || !destinationId) return
    savingRef.current = true
    setMoving(true)
    setError('')
    setSuccess('')
    try {
      const data = await classRequest('/api/klasse/students/transfer', { studentId: student.user_id, destinationClassId: destinationId })
      setOverview(current => current && { ...current, students: current.students.filter(item => item.user_id !== data.movedStudentId) })
      setPendingMove(null)
      setSuccess(`${student.full_name} er flyttet til ${destinations.find(item => item.id === destinationId)?.name || 'den nye klassen'}. Brukernavn og passord er beholdt.`)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Kunne ikke flytte eleven.')
    } finally { savingRef.current = false; setMoving(false) }
  }

  async function removeStudent(event: FormEvent, student: Student) {
    event.preventDefault()
    if (savingRef.current || confirmation.trim() !== 'slett') return
    savingRef.current = true
    setRemoving(true)
    setError('')
    setSuccess('')
    try {
      const data = await classRequest('/api/klasse/students', { studentId: student.user_id, confirmation: confirmation.trim() }, 'DELETE')
      setOverview(current => current && { ...current, students: current.students.filter(item => item.user_id !== data.deletedStudentId) })
      setPendingRemoval(null)
      setConfirmation('')
      setSuccess(`Elevkontoen til ${student.full_name} er slettet og fjernet fra klassen.`)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Kunne ikke slette elevkontoen.')
    } finally {
      savingRef.current = false
      setRemoving(false)
    }
  }

  async function submit(event: FormEvent, action: 'class' | 'student') {
    event.preventDefault()
    if (savingRef.current) return
    savingRef.current = true
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      if (action === 'class') {
        const data = await classRequest('/api/klasse', { name, level })
        await load(data.classroom.id)
        setSuccess('Klassen er opprettet. Du kan nå legge til elever.')
      } else {
        const data = await classRequest('/api/klasse/students', { fullName, username, password, classId: overview?.classroom?.id })
        setOverview(current => current && { ...current, students: [...current.students, data.student] })
        setSuccess(`${data.student.full_name} er lagt til med brukernavnet ${data.student.username}.`)
        setFullName('')
        setUsername('')
        setPassword('')
        nameInput.current?.focus()
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Kunne ikke fullføre. Prøv igjen.')
    } finally {
      savingRef.current = false
      setSaving(false)
    }
  }

  return (
    <>
      <div className="global-fixed-bg" />
      <header className={styles.adminNav}>
        <Link href="/portal/admin" className={styles.adminBack}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
          Admin
        </Link>
      </header>
      <main className={`${styles.page} ${styles.adminPage}`}>
        <header className={styles.header}>
          <p>Klasseadministrasjon</p>
          <h1 dir="auto">{overview?.classroom?.name || 'Min klasse'}</h1>
          <span>Din klasse, dine elever. Opprett elevkontoer og hold oversikten her.</span>
        </header>
        {overview && <div className={styles.form} style={{ marginBottom: 24 }}><label htmlFor="selected-class">Mine klasser</label><select id="selected-class" value={overview.classroom?.id || ''} disabled={saving || moving || removing || loading} onChange={e => { setPendingMove(null); setPendingRemoval(null); void load(e.target.value) }}><option value="" disabled>Velg klasse</option>{overview.classrooms.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select><button className={styles.button} disabled={saving || moving || removing || loading} onClick={() => { setOverview(current => current && { ...current, classroom: null, students: [] }); setName(''); setPendingMove(null); setPendingRemoval(null) }}>Ny klasse</button></div>}
        {error && <p className={styles.error} role="alert">{error}</p>}
        {overview?.classroom && <p style={{marginBottom:24}}><Link className={styles.button} href={`/portal/admin/klasse/undervisning?classId=${overview.classroom.id}`}>Åpne klasserom: leksjoner, timeplan og oppmøte →</Link></p>}
        {success && <p className={styles.success} role="status">{success}</p>}
        {loading ? <p className={styles.muted} role="status">Henter klassen…</p> : !overview ? (
          <button className={styles.button} onClick={() => load()}>Prøv igjen</button>
        ) : !overview.classroom ? (
          <section className={styles.panel} aria-labelledby="create-class">
            <h2 id="create-class">Opprett din klasse</h2>
            <p className={styles.muted}>Velg et navn. Elevene du oppretter blir tilknyttet denne klassen.</p>
            <form className={styles.form} onSubmit={event => submit(event, 'class')}>
              <label htmlFor="class-name">Klassenavn</label>
              <input id="class-name" dir="auto" value={name} onChange={event => setName(event.target.value)} required maxLength={120} disabled={saving} placeholder="Skriv navnet på klassen" />
              <label htmlFor="class-level">Nivå</label><select id="class-level" value={level} onChange={e => setLevel(Number(e.target.value))} disabled={saving}>{[1,2,3].map(n => <option key={n} value={n}>Nivå {n}</option>)}</select>
              <button className={styles.button} disabled={saving}>{saving ? 'Oppretter…' : 'Opprett klasse'}</button>
            </form>
          </section>
        ) : (
          <div className={styles.columns}>
            <section className={styles.panel} aria-labelledby="roster-title">
              <div className={styles.sectionHeading}>
                <h2 id="roster-title">Elever</h2>
                <span className={styles.count}>{overview.students.length}</span>
              </div>
              {overview.students.length === 0 ? (
                <div className={styles.empty}>
                  <h3>Klassen er klar</h3>
                  <p>Legg til den første eleven for å komme i gang.</p>
                </div>
              ) : (
                <ul className={styles.roster}>
                  {overview.students.map(student => (
                    <li key={student.user_id}>
                      <span className={styles.avatar} aria-hidden="true">{student.full_name.slice(0, 1).toUpperCase()}</span>
                      <div className={styles.studentIdentity}><strong dir="auto">{student.full_name}</strong><span>Brukernavn: <bdi>{student.username}</bdi></span></div>
                      <div className={styles.studentActions}>
                        <button type="button" className={styles.moveButton} disabled={saving || removing || moving || destinationsLoading || !overview.canCreateStudents} aria-label={`Flytt ${student.full_name} til en annen klasse`} aria-expanded={pendingMove === student.user_id} onClick={() => openMove(student)}>Flytt</button>
                        <button type="button" className={styles.removeButton} disabled={saving || removing || moving || destinationsLoading || !overview.canCreateStudents} aria-label={`Slett elevkontoen til ${student.full_name}`} aria-expanded={pendingRemoval === student.user_id} onClick={() => { setPendingMove(null); setPendingRemoval(student.user_id); setConfirmation(''); setSuccess(''); setError('') }}>Slett elev</button>
                      </div>
                      {pendingMove === student.user_id && (
                        <form className={`${styles.form} ${styles.moveConfirmation}`} onSubmit={event => moveStudent(event, student)} aria-labelledby={`move-title-${student.user_id}`}>
                          <h3 id={`move-title-${student.user_id}`}>Flytt <bdi>{student.full_name}</bdi></h3>
                          <p>Eleven beholder brukernavn og passord. Den nye ustadhen overtar klasseadministrasjonen for eleven.</p>
                          {destinationsLoading ? <p role="status">Henter klasser…</p> : destinations.length === 0 ? <p>Ingen andre klasser er tilgjengelige. Mottakerens klasse må opprettes først.</p> : (
                            <><label htmlFor={`move-destination-${student.user_id}`}>Mottakerklasse</label><select id={`move-destination-${student.user_id}`} value={destinationId} onChange={event => setDestinationId(event.target.value)} required disabled={moving}><option value="">Velg klasse</option>{destinations.map(destination => <option key={destination.id} value={destination.id}>{destination.name}</option>)}</select></>
                          )}
                          <div className={styles.deleteActions}>
                            <button type="button" className={styles.button} disabled={moving} onClick={() => setPendingMove(null)}>Avbryt</button>
                            <button className={styles.button} disabled={saving || moving || !destinationId || destinationsLoading}>{moving ? 'Flytter…' : 'Bekreft flytting'}</button>
                          </div>
                        </form>
                      )}
                      {pendingRemoval === student.user_id && (
                        <form className={`${styles.form} ${styles.deleteConfirmation}`} onSubmit={event => removeStudent(event, student)} aria-labelledby={`delete-title-${student.user_id}`}>
                          <h3 id={`delete-title-${student.user_id}`}>Slett elevkontoen til <bdi>{student.full_name}</bdi>?</h3>
                          <p>Elevens innloggingskonto og klassetilhørighet slettes permanent. Dette kan ikke angres.</p>
                          <label htmlFor={`delete-confirm-${student.user_id}`}>Skriv <b>slett</b> for å bekrefte</label>
                          <input id={`delete-confirm-${student.user_id}`} value={confirmation} onChange={event => setConfirmation(event.target.value)} autoComplete="off" autoCapitalize="none" spellCheck={false} disabled={saving || removing} required />
                          <div className={styles.deleteActions}>
                            <button type="button" className={styles.button} disabled={removing} onClick={() => { setPendingRemoval(null); setConfirmation('') }}>Avbryt</button>
                            <button className={`${styles.button} ${styles.deleteButton}`} disabled={saving || removing || confirmation.trim() !== 'slett'}>{removing ? 'Sletter…' : 'Slett elevkonto permanent'}</button>
                          </div>
                        </form>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </section>
            <section className={styles.panel} aria-labelledby="add-student">
              <h2 id="add-student">Legg til elev</h2>
              <p className={styles.muted}>Eleven logger inn på <Link href="/login">studentportalen</Link> med brukernavn og passord.</p>
              {!overview.canCreateStudents && <p className={styles.notice}>Elevoppretting er ikke aktivert ennå. Kontakt administrator.</p>}
              <form className={styles.form} onSubmit={event => submit(event, 'student')}>
                <fieldset disabled={saving || removing || moving || !overview.canCreateStudents}>
                  <label htmlFor="student-name">Fullt navn</label>
                  <input ref={nameInput} id="student-name" dir="auto" value={fullName} onChange={event => setFullName(event.target.value)} maxLength={120} autoComplete="off" required />
                  <label htmlFor="student-username">Brukernavn</label>
                  <input id="student-username" value={username} onChange={event => setUsername(event.target.value.toLowerCase())} minLength={3} maxLength={32} pattern="[a-z0-9][a-z0-9._\-]{2,31}" autoComplete="off" autoCapitalize="none" spellCheck={false} aria-describedby="username-help" required />
                  <p id="username-help" className={styles.hint}>3–32 tegn. Bruk a–z, tall, punktum, bindestrek eller understrek. Start med en bokstav eller et tall.</p>
                  <label htmlFor="student-password">Passord</label>
                  <input id="student-password" type="password" value={password} onChange={event => setPassword(event.target.value)} minLength={12} maxLength={128} autoComplete="new-password" aria-describedby="password-help" required />
                  <p id="password-help" className={styles.hint}>Minst 12 tegn. Gi innloggingsopplysningene direkte til eleven. Passordet kan ikke vises etter oppretting.</p>
                  <button className={styles.button}>{saving ? 'Legger til…' : 'Legg til elev'}</button>
                </fieldset>
              </form>
            </section>
          </div>
        )}
      </main>
    </>
  )
}
