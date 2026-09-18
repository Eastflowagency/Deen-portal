export type Classroom = { id: string; name: string; level: number; owner_id: string }
export type Lesson = { id: string; class_id: string; course_slug: string; title: string; summary: string; book_pages: string; book_questions: string; published: boolean; created_at: string }
export type ClassSession = { id: string; class_id: string; lesson_id: string; starts_at: string; ends_at: string; status: 'scheduled' | 'completed' | 'cancelled' }
export type Material = { id: string; class_id: string; lesson_id: string; title: string; url: string | null; storage_path: string | null }
export type Announcement = { id: string; class_id: string; title: string; message: string; published: boolean; created_at: string }
export const ATTENDANCE_LABELS = { present: 'Til stede', late: 'Forsinket', absent: 'Fravær', excused: 'Gyldig fravær' } as const
export type AttendanceStatus = keyof typeof ATTENDANCE_LABELS
export type Attendance = { session_id: string; student_id: string; student_name: string; status: AttendanceStatus; marked_at: string }
export type ClassroomData = {
  classrooms: Classroom[]; classroom: Classroom | null; canManage: boolean; teacherName: string;
  lessons: Lesson[]; sessions: ClassSession[]; materials: Material[]; announcements: Announcement[];
  attendance: Attendance[]; roster: { user_id: string; full_name: string; username: string }[];
  notes: { lesson_id: string; notes: string }[];
}
export function osloInput(iso: string) {
  if (!iso) return ''
  return new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Oslo', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(new Date(iso)).replace(' ', 'T')
}
export function osloToIso(local: string) {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(local)) throw new Error('Velg dato og klokkeslett.')
  const utc = Date.parse(local + ':00Z')
  if (!Number.isFinite(utc)) throw new Error('Ugyldig dato.')
  const candidates = [1,2].map(offset => new Date(utc-offset*3600000).toISOString()).filter(iso => osloInput(iso) === local)
  if (candidates.length !== 1) throw new Error('Tidspunktet faller i en overgang mellom sommer- og vintertid. Velg et annet klokkeslett.')
  return candidates[0]
}
export function displayTime(iso: string) {
  return new Intl.DateTimeFormat('nb-NO', { timeZone: 'Europe/Oslo', weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(iso))
}
export function attendanceSummary(rows: Attendance[]) {
  const counts = { present: 0, late: 0, absent: 0, excused: 0 }
  rows.forEach(row => { counts[row.status]++ })
  const denominator = counts.present + counts.late + counts.absent
  return { ...counts, percent: denominator ? Math.round(100*(counts.present+counts.late)/denominator) : null }
}
