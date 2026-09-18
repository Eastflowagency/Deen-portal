# Class administration setup

**Current version:** first read the [Session 1 handover](session-one-handover.md). The new application requires the third migration and now supports multiple classes per teacher and trusted database roles. The historical single-class setup below remains for reference.

The initial teacher is the existing Supabase Auth account `shabdullahi@alrawdah.no`.
This feature supports one class per teacher and one class per student. The teacher
chooses the class name on first use; Arabic names are supported.

## Activate in the existing Supabase project

1. Open the project's Supabase SQL Editor. Run the contents of
   `supabase/migrations/202609150001_teacher_classes.sql` once. It creates the class
   tables and row-level access rules, and grants the designated existing Auth user
   the teacher role by UUID. If that account does not exist, the transaction rolls
   back with an explanatory error. Do not create a replacement account.
2. Add `SUPABASE_SERVICE_ROLE_KEY` to the local `.env.local`, using the server key
   from the **same** Supabase project as the current public URL and anon key. Enter
   it locally; do not paste the value in chat, commit it, or prefix it with
   `NEXT_PUBLIC_`. Existing environment values should remain in place.
3. Restart `npm run dev` after updating the environment.
4. Sign in as the designated teacher. Open `/portal/admin`, select **Klasse**,
   and create the class. Add a student with a name, unique username and password.
5. In a separate browser session, sign in at `/login` with that student's username
   and password. Open **Min klasse** in the portal to see their assigned class.

Local entry: <http://localhost:3000/portal/admin/klasse>

## Enable student deletion and transfers

After the first migration, run
`supabase/migrations/202609150002_student_moves.sql` once in SQL Editor. It adds a
server-managed deletion reservation to prevent moving a student during deletion.
The **Slett elev** and **Flytt** actions fail safely until this migration is applied.

**Slett elev** cancels membership by deleting the student's login account and
class membership after typing lowercase `slett` to confirm. **Flytt** selects another
existing class and changes membership and teacher ownership together; the student
keeps their account, username and password. The original teacher loses roster
access and the destination teacher gains it. Only destination names and IDs are
shown in the transfer picker, not other teachers' rosters. A destination teacher
and class must already exist; teacher onboarding is configured separately.

## Account and access model

- `class_teachers` is the authoritative teacher role list. Application users cannot
  grant themselves this role. The API verifies the session with Supabase `getUser()`.
- `teacher_classes.owner_id` points to the teacher's Auth UUID, with a uniqueness
  constraint limiting each teacher to one class.
- `class_students` links the student Auth UUID to the class and owner. A composite
  foreign key prevents mismatched ownership. Teachers can read their own roster;
  students can read only their own membership and class. Neither can change class
  ownership or directly write enrollments through the public database API.
- Student creation derives the class and owner from the verified teacher session.
  The server creates the Auth account and then enrollment. If enrollment fails,
  it attempts to delete the newly created Auth account. A failed cleanup reports a
  safe error and logs only the affected Auth UUID for administrator repair.
- No plaintext passwords are stored in class tables, API responses or logs.
  Passwords are passed directly to Supabase Auth. The teacher supplies the initial
  password and shares it privately; the roster cannot recover or display it.
- **Slett elev** permanently deletes an owned student's Auth account after the
  teacher types lowercase `slett` to confirm. The existing `ON DELETE CASCADE` foreign
  key removes the class membership in the same database transaction. Failed Auth deletion does not independently remove the
  membership. Teacher accounts, configured administrators and accounts outside
  the class-created username namespace cannot be deleted through this endpoint.
  This is account and membership deletion, not a guarantee of erasing backups or
  unrelated historical records. Storage-owned objects can block Auth deletion;
  the UI then reports failure for an administrator to resolve.
  Existing access JWTs may remain valid until expiry; the portal middleware and
  class API validate users through Auth, and class RLS finds no deleted membership.
  If the server stops after reserving a membership, an administrator must check
  whether its Auth account still exists and clear `deletion_pending` on the
  surviving membership before retrying. Do not clear it during an active deletion.
- Usernames are normalized to lowercase and mapped internally to
  `<username>@students.alrawdah.invalid`. This reserved, non-deliverable namespace
  is an Auth identifier, not an inbox. Existing email/password login still works.
  Email verification is skipped only for accounts explicitly created by the
  authenticated teacher through the server endpoint.
- Existing full admin permissions elsewhere in the app remain as configured.
  The class feature grants access only to the owner's class. It does not grant
  every administrator access to class rosters.

## Verification

Run `node --test tests/class-access.test.cjs` for session, ownership, account
creation, compensation and username checks. Run `npx tsc --noEmit --incremental false`.
Run `node --test tests/class-student-actions.test.cjs` for deletion/transfer scope,
confirmation, account protection, failure recovery and simultaneous-operation guards.
The route tests mock Supabase; they do not prove deployed RLS behavior.

For an isolated PostgreSQL RLS test without touching Supabase, install PGlite in a
temporary directory and run the actual migration against its in-memory database:

```powershell
$classCheckDir = Join-Path $env:TEMP 'alrawdah-class-rls-check'
npm install --prefix $classCheckDir --no-audit --no-fund --ignore-scripts @electric-sql/pglite
$env:PGLITE_TEST_MODULE = Join-Path $classCheckDir 'node_modules/@electric-sql/pglite'
node --test tests/class-rls.test.cjs
```

This checks database roles, ownership, direct-write denial and the composite
foreign key locally. It does not test the live project's Auth configuration.

After applying the migration, verify with separate teacher and student sessions:

1. The designated teacher can create one class and add a student. A duplicate
   username is rejected and a second class cannot be created for the same teacher.
2. A non-teacher account receives 403 from `/api/klasse` and
   `/api/klasse/students`, even with a forged admin email or owner ID in the request.
3. A second authorized teacher (configured separately by a database administrator)
   can read only their own class/roster. Querying another class via Supabase's public
   API returns no records; inserting an enrollment or altering roles is denied.
4. Students can see their own class but cannot read classmates' membership rows,
   see other classes, create classes or add students.
5. Signed-out requests to all class APIs receive 401.

## Current limits

Teacher assignment is controlled in the database. The first account already has
access to the existing admin navigation; adding future teachers to the admin hub
requires a separate access decision. There is no membership-only cancellation,
password-reset administration, attendance, or class-specific lesson feed in this
first version. Username-only accounts cannot receive email password recovery.
# Session 1 update

The current application also requires `supabase/migrations/202609160001_session_one.sql` after the two original class migrations. See [Session 1 handover](session-one-handover.md) for activation and the current database-backed role model, multiple classes, account controls and live/SMS permissions. The original setup below describes the earlier single-class release.
