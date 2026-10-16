# User-test improvement pass

## Implemented in this prototype
- Brand/home links inside the signed-in shell now navigate to People, not the public landing page.
- Connections added to primary navigation; incoming, outgoing and accepted relationships are labelled and linked to chats/profiles.
- Chats show different alignment and colors for each sender, with a profile link.
- Chat supports proposing a public-campus meetup, simulating accept/decline, and showing confirmed meetups in Calendar.
- Onboarding wording clarifies course enrolment, interests, and campus-day preferences.
- Event RSVP status, attendee context, event details buttons, group details and group schedule limitations are clearer.

## Not implemented / limitations
- All prototype state is in React memory and resets on reload. No server, real-time chat, invitations, authentication, or real meetup acceptance.
- The meetup time uses a weekday rather than a dated calendar invitation; it is a user-testing interaction only.
- Group messaging, verified memberships, group recurring schedules, and actual student compatibility scoring are not available.
- Existing illustrative placeholder art remains; replacing it with licensed and relevant event photography needs suitable assets.
- No automated screenshots or manual browser acceptance test completed in this environment.

## Suggested manual regression test
1. Open /people and click the header logo: it should stay in the signed-in app.
2. Navigate to Connections, accept Casey, open chat, and view Casey profile.
3. Send a message; verify your bubble differs from the other sender.
4. Propose a meetup, simulate acceptance, and verify it appears in Calendar.
5. Visit Events, RSVP, open an attendee profile, and return to event details.
6. Open a group and find meeting details and the related event.
7. Restart/reload and confirm prototype-state limitations are communicated to testers.
