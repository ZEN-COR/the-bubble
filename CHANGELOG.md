# The Bubble — Changelog

A running record of product, UX, and implementation changes. Add new entries at the top, and distinguish implemented behaviour from proposed work.

## [Unreleased] — 2026-10-16 — User-testing improvement pass

### Context
Changes were informed by moderated user-testing observations across onboarding, People, Connections, Messages, Events, Groups, and Calendar. Testers struggled to identify accepted requests, distinguish message senders, arrange meetups, interpret onboarding fields, and navigate between events and student profiles.

### Added
- A primary-navigation entry for **Connections**, with clearer incoming, outgoing, and accepted relationship states.
- A prototype **propose meetup → simulate response → confirm → view in Calendar** journey, accessible from chat.
- Links from conversations to student profiles.
- More explicit event RSVP/attendee context and group meeting information where available.

### Changed
- Signed-in brand/home links lead to the People area instead of unexpectedly returning to the public landing page.
- Chat bubbles use differentiated alignment and color to distinguish participants.
- Onboarding copy better explains course enrolment, interests, and campus-day preferences.
- Event and group detail interactions and explanatory text have been clarified.

### Not implemented
- Production authentication, persistent relationships, real-time messages, and server-backed meetup invitations.
- Actual acceptance by another account: meetup acceptance is **simulated locally**.
- Dated calendar invitations, group messaging, verified group membership, recurring schedules, and compatibility scoring.
- Replacement of placeholder event images with relevant licensed photography.

### Verification status
- **Not verified as passing:** dependency installation failed in the execution environment; TypeScript, lint, and automated tests could not be completed.
- **Not completed:** browser-based end-to-end/manual acceptance tests.
- **Required before merge:** run `npm ci`, `npm run typecheck`, `npm test`, `npm run lint`, and `npm run dev` locally, then walk through the user journey below.

### Manual acceptance checklist
- [ ] Logo/header links stay within the signed-in application.
- [ ] Connections shows pending incoming, pending outgoing, and accepted connections.
- [ ] Accept a prototype request and open the resulting conversation and profile.
- [ ] Messages clearly distinguish sender and recipient.
- [ ] Propose a meetup, simulate acceptance, and find it in Calendar.
- [ ] Event RSVP state is clear; attendee profiles and return navigation work.
- [ ] Group detail view explains meeting information and links to related events.
- [ ] Onboarding field descriptions are understandable without facilitator guidance.
- [ ] Reload behaviour is communicated: in-memory prototype changes are not persistent.

### Related documentation
- `USER_TEST_IMPROVEMENTS.md` — concise implementation notes and regression scenario.
- `IMPLEMENTATION_STATUS.md` — broader feature readiness and known limitations.

---

## Entry template (copy for each future change)

### YYYY-MM-DD — Short change title
**Motivation:** What problem or user feedback prompted the change?

**Added:**
- ...

**Changed / Fixed:**
- ...

**Not implemented / limitations:**
- ...

**Verification:**
- [ ] TypeScript
- [ ] Automated tests
- [ ] Lint
- [ ] Manual browser check

**Files / pull request:** ...
