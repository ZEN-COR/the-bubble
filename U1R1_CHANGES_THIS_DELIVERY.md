# The Bubble — U1R1 improvements in this delivery

This delivery builds on the supplied `the-bubble-U1R1.zip` source snapshot. It does not change the original `main` folder or Git history.

## Implemented
- **#1:** People/Groups discovery switch on both screens, with clearer Groups access.
- **#2:** Event organiser profile/contact entry when the organiser matches a sample person; attendee profiles link to Connect actions.
- **#5:** Custom course and interest entries during onboarding.
- **#6:** Interactive month calendar, month navigation, clickable dates, RSVP event markers, and event links.
- **#7:** Reduced landing-page illustration size and clarified privacy/authentication wording.
- **#8:** New signed-in `/home` dashboard; logo and navigation link to Home; onboarding routes there.
- **#9:** Clearer event Join/Leave labels.
- **#12:** Groups and events emphasized as natural ways to connect.

## Remaining work / limitations
- **#2:** A dedicated organiser contact request action is not yet available for organisers absent from sample profiles.
- **#3:** Meetup proposals are based on weekday rather than an exact date; calendar cannot place these on a specific date.
- **#4:** All name links and all message-colour states require full manual verification.
- **#5:** Name editing and shortening onboarding are not completed in this delivery.
- **#7:** Privacy wording should receive formal review before a real deployment.
- **#9:** Event imagery still uses illustrative placeholders.
- **#10:** Group-wide questions and regular meeting schedules require real data and an interaction design.
- **#11:** End-to-end task completion messages still need audit.
- The prototype uses simulated client state. It does not provide production authentication or persistent backend data.

## Local verification
Run `npm ci`, `npm run lint`, `npm test -- --run`, `npm run typecheck`, and `npm run build` in the updated project. Compare to `main` on ports 3001 and 3000 respectively.
