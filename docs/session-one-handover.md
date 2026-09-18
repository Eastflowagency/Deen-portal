# Session 1: foundation and account administration

Implemented locally, without a push or deployment. The user subsequently applied the migration successfully; read-only checks confirmed the Session 1 schema is available. The activation steps below are retained for setup reference. Session 2 requires its separate migration; see `docs/session-two-handover.md`.

## Activate

1. Open the existing Supabase project and its SQL Editor.
2. Run `supabase/migrations/202609160001_session_one.sql` once. The previous two class migrations must already be installed; do not rerun them.
3. Refresh localhost:3000 and sign in again. Open **Admin → Brukere**, or `/portal/admin/accounts`.
4. Verify the admin account, create/assign a teacher's classes, then test that teacher's login. Existing classes keep their IDs and memberships and default to level 1; new classes offer levels 1–3.

The migration is transactional. It does not delete student accounts or recreate existing classes. It preserves the three previously configured admin email identities by bootstrapping their existing Auth accounts into the new role table. Future authorization reads the database, not an email header or editable user metadata. Existing other teachers retain the teacher role; remaining existing accounts and new signups receive the student role.

The service-role key can operate through the data API, but this workspace has no database management/SQL connection to execute this migration. Do not paste credentials into chat.

## Delivered behavior

- `app_accounts` stores trusted `admin`, `teacher`, or `student` roles and `active`/`suspended` membership status. Middleware and API handlers verify the signed-in user. Database policies independently restrict browser reads/writes.
- **Brukere** lets admins create teacher logins, promote/demote teachers, create classes and assign their responsible teacher, reset student passwords, and pause/reactivate membership. Account lists include a student's class/level, with 50 accounts per page. Admin accounts and the acting admin are protected from changes in this UI. A teacher who still owns classes cannot be demoted.
- Teachers see **Klasse**, choose among their own classes, create additional classes, and add students to the selected class. They cannot see another teacher's roster. Students retain one class membership. The destination picker exposes class names/IDs, not other classes' rosters. Transfers to inactive teachers are rejected.
- Existing student deletion still requires lowercase `slett`, ignoring surrounding whitespace. Ownership, staff-account protection, deletion reservations, failure recovery, and permanent Auth deletion remain intact.
- Class reassignment uses a database function to transfer class ownership and roster ownership together. It rejects reassignment while a student deletion is pending.
- SMS requires an authenticated, active admin. The `x-admin-email` header provides no authority. Recipients are validated and deduplicated, with at most 100 recipients per request. Provider errors are not returned verbatim.
- Notification writes use an admin-only server endpoint. Students and teachers can read only active notifications; admins can also see hidden notifications. Browser writes are denied by database privileges.
- Daily room creation and the shared live controls are admin-only. Rooms are private, including reused rooms. Token host privileges derive from the stored role; students/teachers can join only the active shared room as viewers. Admitted speakers need a server grant tied to their account ID, not their display name. Tokens are room-specific and expire. The legacy meetings endpoint cannot create arbitrary rooms for students.
- Live status is persisted in Supabase, including the scheduled time. Failed writes return errors instead of silently pretending an in-memory broadcast is active.
- `lib/curriculum/` supplies the study overview, course details and student portal. Nivå 1 contains Aqidah 1, Fiqh 1, Seerah 1, Adab 1, Dua & Dhikr under Tazkiyah, and annual Arabisk 1. Each level has one Arabic course spanning autumn/spring.
- The one existing Aqidah recording remains published. Draft entries without recordings are retained in the central lesson file but hidden. Other courses show an honest empty state. Tazkiyah 1/2 overview links now have matching detail entries using the existing summary; unspecified learning outcomes and assessment remain explicitly unpublished. Legacy Adab and Arabic study links are preserved.

## Boundaries for the next sessions

- Shared Live and Varsler remain global and admin-controlled. Teacher-owned live sessions belong to Session 3.
- Lesson authoring, schedules, attendance, class announcements and materials belong to Session 2. The central lesson source is code-backed in Session 1; it is not yet a database editor.
- Homework, persistent learning progress and class-specific live/recordings belong to Session 3. The existing lesson completion control is still browser state, not an educational record.
- Suspension denies new protected page/API access and protected database reads. It does not erase previously downloaded data, revoke already-issued Daily tokens immediately, or privatize the existing public recording URL. Existing live broadcasts should be ended and restarted after activation to use private rooms and new tokens.
- Real SMS delivery, video calls and authenticated browser administration were not exercised against real users. Tests use mocked providers and an isolated PostgreSQL database. No real student was deleted, moved, suspended or password-reset as part of verification.
- Public homepage design was not changed. Existing local work remains uncommitted.

## Validation

Run TypeScript checking with `npx tsc --noEmit --incremental false`.

Run the unit/API tests with:

```powershell
node --test tests/class-access.test.cjs tests/class-student-actions.test.cjs tests/session-one-access.test.cjs tests/curriculum.test.cjs
```

The PostgreSQL tests need `@electric-sql/pglite`. In this workspace it is installed in a temporary test-only directory, not added as an application dependency:

```powershell
$env:PGLITE_TEST_MODULE = Join-Path $env:TEMP 'alrawdah-class-rls-check/node_modules/@electric-sql/pglite'
node --test tests/class-rls.test.cjs tests/session-one-rls.test.cjs
```

Coverage includes forged-role/header rejection, unauthorized side-effect prevention, Daily viewer/speaker/owner permissions, SMS validation, protected admin accounts, class ownership, deletion/transfer safety, multiple-class isolation, suspension, migration preservation, and canonical curriculum consistency.

Daily token properties follow the [official meeting-token API](https://docs.daily.co/reference/rest-api/meeting-tokens/create-meeting-token).
