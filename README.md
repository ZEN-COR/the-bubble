# The Bubble

The Bubble is a mobile-first app for verified university students to find classmates, groups, and campus events. It is not a dating app, and it is not a university service.

This repository is at milestone M0: the app shell, design foundation, database migrations, and local checks. Sign-in, discovery, chat, RSVP, and moderation are not connected yet.

## Local setup

Requirements: Node.js 24 and npm.

```bash
npm install
copy .env.example .env.local
npm run dev
```

Open http://localhost:3000.

To click through without a network connection, stop the dev server and run `npm run offline`. That writes a static copy into `out` and opens it at http://127.0.0.1:4173. Other computers on the same Wi-Fi can use the network address printed in that terminal. The folder still needs Node to be served, because the pages cannot be opened by double-clicking the HTML files. Nothing in that copy calls the internet. Each browser keeps its own visit.

Leave `ALLOWED_UNIVERSITY_EMAIL_DOMAINS` empty until the real domains are confirmed. An empty list allows nobody. A confirmed email on an allowed domain is not proof of identity or course enrolment.

`SUPABASE_SERVICE_ROLE_KEY` is server-only. Do not prefix it with `NEXT_PUBLIC_` and do not import `lib/supabase/admin.ts` from a client component.

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start the Next.js app |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript |
| `npm test` | Unit, component, and database policy tests |
| `npm run build` | Static export into `out` |
| `npm run offline` | Build the static copy and open it offline on port 4173 |
| `npm run test:e2e` | Playwright smoke test. Not part of the M0 CI job |

## Database

Migrations live in `supabase/migrations`. They expect Supabase Auth (`auth.users`, `auth.uid()`).

`supabase/seed.sql` loads fictional courses and, on a real Supabase auth schema, fictional students. Local fixture sign-in password is `fixture-password` and the local allowlist domain is `example.test`. Do not run the seed in production, and remove `example.test` before any real deployment.

The auth half of the seed was not executed in M0 because this workspace did not have a Supabase project. The reference rows and the row-level security rules were applied with an in-memory Postgres engine during `npm test`.

Suggested local Supabase flow, once the CLI and Docker are available:

```bash
npx supabase init
npx supabase start
npx supabase db reset
```

If `supabase init` creates a second migrations folder, keep the SQL files already in `supabase/migrations`.

## What works in this milestone

- Responsive shell: landing page, bottom navigation, desktop sidebar, and route placeholders
- Presentational cards, dialogs, onboarding preview, and feed states
- Email-domain parsing that does not hardcode a university
- Postgres schema, row-level security, and fictional seed SQL

Placeholder screens say when a feature is not connected. They do not load student data.

## Privacy notes before a public launch

- Do not collect student IDs, exact timetables, live location, or contact uploads.
- Do not imply university endorsement or use official branding.
- Review the NZ Privacy Act 2020, data retention, account deletion, and age-safety policy before production.
- Moderator access must stay in database policy. The moderation URL is reachable in this milestone and is not a security boundary.
