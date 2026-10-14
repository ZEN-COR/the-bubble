# Implementation status

Updated: 14 October 2026. Milestone M0 is in place. A clickable design prototype sits on top of it. Real auth and database writes are not implemented.

## Milestone checklist

- [x] M0 Foundation: app shell, styles, env template, migrations, seed file, lint/typecheck/test/build scripts, README
- [ ] M1 Auth and onboarding: domain-checked login, saved profile, protected routes and data
- [ ] M2 People: recommendations, filters, profiles, requests, accept/decline/block in the product
- [ ] M3 Messages: accepted pairs only, realtime, pagination
- [ ] M4 Events: feed, filters, create, RSVP, consented attendees, calendar ICS
- [ ] M5 Groups: browse, public join, private invitation, group events in the product
- [ ] M6 Quality: responsive QA, accessibility audit, end-to-end journeys, moderation UI, deployment guide

## Architecture

- Next.js 16 App Router, React 19, TypeScript strict, Tailwind CSS 4, shadcn/ui (Radix Nova), Lucide.
- Routes: `app/(auth)` for sign-in, verify, and onboarding; `app/(main)` for the shell and the clickable prototype screens.
- Shared UI in `components`. Presentational feature pieces in `features`. Domain helpers in `lib/auth`, `lib/validation`, and `lib/supabase`.
- Supabase clients exist for later milestones. Pages do not call them. `lib/supabase/server.ts` and `lib/supabase/admin.ts` import `server-only`. The service role key is never read by the browser client.
- SQL lives in `supabase/migrations/0001_schema.sql` and `supabase/migrations/0002_rls.sql`. Fictional fixtures are in `supabase/seed.sql` and `fixtures/dev-data.ts`.
- Vitest covers pure helpers, components, and row-level security through PGlite. Playwright is configured and not part of CI yet.

## Assumptions

- Allowed university domains come from `ALLOWED_UNIVERSITY_EMAIL_DOMAINS` in the app and from `private.allowed_email_domains` in the database. Neither is pre-filled with a real university domain. An empty list allows nobody.
- A confirmed email on an allowed domain is not identity verification or enrolment verification. Courses are user-supplied.
- `profiles.app_role` is `student` or `moderator`. Students cannot update `app_role` or `status`.
- `profiles.life_stage` and `profiles.meeting_preferences` were added because the product needs those optional fields and the spec did not name columns. Authenticated users cannot select `life_stage` directly. `visible_life_stage()` returns it to the owner, or to someone who can view the profile only when `life_stage_opt_in` is true.
- Campus weekdays use ISO numbering, Monday = 1 through Sunday = 7. Other students cannot select `campus_days`. Overlap is a boolean from `profiles_share_opted_in_campus_day()`, and only for one of the two people involved.
- Discovery reads active profiles that are discoverable, or an accepted connection. Suspended profiles and either-direction blocks are hidden. The owner can still read their own profile after verification.
- Declined and cancelled requests are hidden from the requester. A new request can exist after a decline because the unique pair index covers only `pending` and `accepted`.
- Clients cannot set a request to `accepted`, and cannot insert `connections` or `conversations`. The atomic accept function is M2.
- A block hides further messages as well as discovery. That is stricter than "hide the connection surface" and is deliberate.
- A published event on a private group is visible to the creator, moderators, and active or invited members. Hidden RSVPs stay hidden from the event creator.
- Group membership rows are visible for yourself, or for an active member whose profile you can already view. There is no client insert on `group_members`.
- Text limits match `lib/validation/limits.ts` and the SQL checks. Display name is 1–40 characters. Bio is 280. A message is 2000.
- `example.test` in the seed is a local fixture domain only. The fixture password `fixture-password` is not a production credential.
- The moderation URL is reachable. It is not an access-control boundary.

## Completed in M0

- Responsive shell: landing page, skip link, desktop sidebar, labelled mobile tabs, 44px controls on primary buttons and inputs, reduced-motion fallback, indigo and violet tokens.
- Screens for every route in the spec. They use fictional students held in memory for the visit. Reset clears that visit. Nothing is written to Supabase.
- Person, event, group, conversation, report, and onboarding pieces. In the prototype, connect, RSVP, join, send, and finish update that in-memory visit. The same cards stay disabled when those handlers are omitted.
- Environment template, GitHub Actions workflow, and README.
- Schema, row-level security, and a seed file.

## Checks run

| Check | Result |
| --- | --- |
| `npm test` | Passed. 7 files, 27 tests |
| `npm run lint` | Passed |
| `npm run typecheck` | Passed |
| `npm run build` | Passed. 22 static or partially prerendered routes |
| `npm run test:e2e` | Not run |
| Supabase CLI / `db reset` | Not run |
| GitHub Actions | Workflow file added. Not executed from this machine |

Vitest prints a non-failing warning that `vitest.config.ts` is loaded as CommonJS.

`npm audit` reports 5 high severity findings in the dependency tree. They were not patched in this milestone.

## Test coverage that did pass

- Empty allowlist rejects every email. Exact domain match only. No university domain is hardcoded in SQL.
- Auckland daylight-saving formatting for 3 November 2026, 04:30 UTC.
- Person, event, and group cards; disabled messaging and reporting; onboarding step movement without saving; shell labels.
- Anonymous, unconfirmed, and non-allowlisted users cannot read profiles.
- Verified users cannot select `life_stage` or update `status`.
- Opted-out life stage stays hidden. Opted-in life stage is readable by someone who can view the profile.
- Non-discoverable profiles are hidden unless connected. Suspended profiles are hidden. A block hides the profile.
- Campus-day rows are not readable by the other person. The overlap function returns a boolean only for a person in the pair.
- Requests cannot target yourself, a hidden person, or an existing active pair. The requester cannot mark a request accepted. After a decline, the requester cannot read that row and the recipient can.
- Private groups, private-group events, and unpublished events are hidden from an outsider. A hidden RSVP is hidden from the event creator. A visible RSVP is readable by another verified student who can view that profile.
- A non-participant cannot read messages or insert a conversation. A block stops reading and sending.
- Reports are visible to the reporter and a moderator, not to the reported person.
- `profiles` has no email column.

## Not tested, so not claimed as working

- Sign-in, sessions, route protection, and onboarding persistence.
- Recommendation scoring and search.
- Creating the accepted connection and its conversation in one transaction.
- Realtime chat, pagination, and rate limits.
- Event and group creation from the app. Insert policies exist in SQL and were not exercised.
- RSVP writes, ICS export, and notification delivery.
- The Supabase seed's `auth.users` insert. PGlite has a stub auth table, so that block skips itself.
- Playwright journeys, screen-reader audit, and a 375px browser pass.
- Remote CI.

## Blockers

- No Supabase project is configured. Do not paste service-role keys into chat. Put them in `.env.local` when M1 needs a real project.
- Google font download failed during the first production build, so the app uses the system font stack.
- Node.js 24 was installed on this machine because `node` was not on the shell path.

## Clickable prototype

Fictional students live in `features/prototype`. The visit is in memory. Refresh or Reset starts again. Sign-in does not email anyone; "Enter the prototype" opens People. Connect, accept, decline, chat, RSVP, group join, privacy toggles, and a report receipt all update that visit. `/admin/moderation` can mark a report triaged. It is still not access-controlled.

## Manual check

1. `npm install`
2. `copy .env.example .env.local`
3. `npm run dev` and open http://localhost:3000
4. Choose "Open the prototype".
5. Connect with someone, accept the incoming request, send a chat, RSVP to an event, and join a group.
6. Open Calendar and confirm the events you marked as going.
7. Use Reset and confirm the visit returns to the starting fixture.

## Next milestone

M1 is auth and onboarding. It needs a Supabase project, confirmed email domains in both the env allowlist and `private.allowed_email_domains`, magic-link or OTP sign-in, server-side domain checks, and a guarantee that an unverified account cannot read protected tables or open protected screens.
