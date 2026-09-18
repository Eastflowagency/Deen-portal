// Usernames use a reserved Auth email namespace; no email is sent to these addresses.
export const STUDENT_USERNAME = /^[a-z0-9][a-z0-9._-]{2,31}$/
const STUDENT_EMAIL_SUFFIX = '@students.alrawdah.invalid'

export function loginEmail(identifier: string) {
  const normalized = identifier.trim().toLowerCase()
  return normalized.includes('@') ? normalized : `${normalized}${STUDENT_EMAIL_SUFFIX}`
}

export function studentUsername(email: string): string | null {
  const normalized = email.trim().toLowerCase()
  if (!normalized.endsWith(STUDENT_EMAIL_SUFFIX)) return null
  const username = normalized.slice(0, -STUDENT_EMAIL_SUFFIX.length)
  return STUDENT_USERNAME.test(username) ? username : null
}

export function validateStudent(input: unknown) {
  if (!input || typeof input !== 'object') return null
  const { username, password, fullName } = input as Record<string, unknown>
  if (typeof username !== 'string' || typeof password !== 'string' || typeof fullName !== 'string') return null
  const normalized = username.trim().toLowerCase()
  if (!STUDENT_USERNAME.test(normalized) || password.length < 12 || password.length > 128 ||
      !fullName.trim() || fullName.trim().length > 120) return null
  return { username: normalized, password, fullName: fullName.trim() }
}
