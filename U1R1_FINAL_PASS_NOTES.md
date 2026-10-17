# U1R1 final pass — changes and verification

## Changes
- Group cards explicitly link to group and meeting details. Group pages now show the next listed activity (where provided), opt-in member profile links, and a contact route through the existing connection workflow. No group-wide chat or recurring schedule was invented.
- Course code entry is limited to the **five** codes in `courseOptions` in `features/prototype/data.ts`. Unknown codes display an error. This is a limited prototype catalogue, **not** authoritative university course validation or enrolment verification. Free-text interests remain supported.
- Landing page explicitly labels illustrative cards as noninteractive. Event actions have clearer RSVP labels, attendee detail links, and a live status announcement.

## Manual acceptance checks
1. `/groups`: choose **View group & meeting details**; verify the page lists the related event if one exists and allows navigation to opted-in member profiles.
2. `/setup/courses`: enter `COMP261` (accepted) and `ASFDJAS` (rejected). Check that selecting a listed course and continuing still works.
3. `/setup/interests`: add a custom interest and continue.
4. `/`: verify the how-it-works cards are explanatory rather than clickable.
5. `/events`: RSVP Going, open event details, choose Leave event, and verify the status changes.

## Verification limitation
The archive was edited in a container where dependency installation did not finish before timeout and Node.js v22.16.0 is below the declared requirement of some dependencies. TypeScript, tests and build could **not** be rerun here. Run `npm ci`, `npx tsc --noEmit`, `npm run lint`, `npm test -- --run`, and `npm run build` on the local machine before integration.
