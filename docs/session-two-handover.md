# Session 2: classroom teaching

Implemented locally; not pushed or deployed. Session 1 is confirmed installed. A read-only check on 2026-09-17 returned missing-table responses for `class_lessons`, `class_sessions` and `class_attendance`: Session 2 is not activated yet.

## Activate

Run `supabase/migrations/202609160002_session_two.sql` in the existing project's Supabase SQL Editor after the Session 1 migration. Refresh the portal afterward. This adds classroom tables, authorization policies and the private PDF bucket. It does not recreate accounts or classes.

## Using the classroom

- Teachers: Admin → Klasse → select a class → Åpne klasserom. Direct route: `/portal/admin/klasse/undervisning`.
- Students: `/portal/klasse`. Students see their current class's published lessons and announcements.
- Create lessons using the class level's curriculum. Add descriptions, book pages, questions and optional private teacher notes. Publish when ready.
- Attach PDFs (maximum 10 MB) or HTTPS links to a lesson.
- Use Timeplan to schedule individual lessons in Europe/Oslo time. Calendar and Timeplan open the same weekly schedule; recurring events and month view are not implemented.
- Record attendance for started, non-cancelled sessions. Unmarked students are not automatically absent. Excused absence is excluded from attendance-rate calculations.
- Publish class announcements or save drafts. Deletion requires `slett`.

## Access and data handling

Active teachers manage their own classes; active administrators manage all classes. Database row-level policies enforce access independently of the interface. Draft lessons, draft announcements and private teacher notes are unavailable to students. Student API responses omit the roster and private notes.

PDFs are private and signed links expire after 60 seconds. Expiration does not revoke a previously downloaded copy. Resource uploads use generated filenames; failed metadata saves attempt file cleanup.

Attendance validates current class membership in the database and derives identity snapshots from trusted records. Sessions with attendance cannot be moved to another time or lesson. Transferred students' historical attendance is retained; the current UI displays the selected/current class. Teachers see historical rows for moved students without editing them. Student account deletion cascades their attendance records.

There is no lesson deletion control: unpublish lessons or cancel scheduled sessions instead. Existing shared course recordings remain separate from teacher-created classroom lessons.

## Course cards

The portal catalogue restores illustrated subject cards, roman numerals and level badges, grouped by level with Høst og vår labels. Level 2 and 3 cards show forthcoming years. The agreed first-year subjects and one annual Arabic course per level are preserved. This does not change the public homepage.

## Validation

All 51 Node tests pass, including isolated PostgreSQL execution of migrations and cross-class authorization, draft/private-note access, PDF storage policies, attendance validation and API input checks. Browser automation did not complete client hydration in the local headless environment; interactive end-to-end behavior is not claimed as verified. No real students, announcements, attendance or files were created during testing.

## Remaining scope

Session 3: homework, persistent progress and class-specific live/recording integrations. Apply the Session 2 migration and verify a teacher and a student account before starting that work.
