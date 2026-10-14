import { render, screen } from "@testing-library/react";
import userEvent, { PointerEventsCheckLevel } from "@testing-library/user-event";
import { expect, test, vi } from "vitest";

import { ErrorState } from "@/components/states/error-state";
import { EventCard } from "@/features/events/event-card";
import { GroupCard } from "@/features/groups/group-card";
import { ConversationPanel } from "@/features/messages/conversation-panel";
import { OnboardingPreview } from "@/features/onboarding/onboarding-preview";
import { PersonCard } from "@/features/people/person-card";
import { ReportDialog } from "@/features/safety/report-dialog";
import { fixtureEvents, fixtureGroups, fixturePeople } from "@/fixtures/dev-data";

test("person cards explain common ground and do not show an email", () => {
  const person = fixturePeople[0];

  render(
    <PersonCard
      id={person.id}
      displayName={person.displayName}
      degree={person.degree}
      major={person.major}
      sharedTags={[...person.sharedTags]}
      explanation={person.explanation}
    />,
  );

  expect(screen.getByText("Avery Chen")).toBeInTheDocument();
  expect(screen.getByText("Both take COMP261")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Connect" })).toBeDisabled();
  expect(document.body.textContent).not.toContain("@");
});

test("event cards label student-created events and verified organizers differently", () => {
  const event = fixtureEvents[0];

  const { rerender } = render(
    <EventCard
      id={event.id}
      title={event.title}
      startsAtLabel={event.startsAtLabel}
      locationLabel={event.locationLabel}
      relevance={event.relevance}
      organizerVerified={false}
    />,
  );

  expect(screen.getByText("Student-created")).toBeInTheDocument();
  expect(screen.queryByText("Verified organizer")).not.toBeInTheDocument();

  rerender(
    <EventCard
      id={event.id}
      title={event.title}
      startsAtLabel={event.startsAtLabel}
      locationLabel={event.locationLabel}
      relevance={event.relevance}
      organizerVerified
    />,
  );

  expect(screen.getByText("Verified organizer")).toBeInTheDocument();
});

test("group cards show a membership count and a disabled join action", () => {
  const group = fixtureGroups[0];

  render(
    <GroupCard
      id={group.id}
      name={group.name}
      description={group.description}
      memberCount={group.memberCount}
    />,
  );

  expect(screen.getByText("2 members")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Join" })).toBeDisabled();
});

test("the message composer is unavailable", () => {
  render(
    <ConversationPanel
      messages={[
        {
          id: "m1",
          senderName: "Avery Chen",
          body: "Want to meet at the library foyer?",
          sentAt: "2026-11-03T04:30:00.000Z",
          sentAtLabel: "5:30 pm",
        },
      ]}
    />,
  );

  expect(screen.getByRole("list", { name: "Messages" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Send" })).toBeDisabled();
  expect(screen.getByText("Messaging is not available in this build.")).toBeInTheDocument();
});

test("the report dialog does not submit", () => {
  render(<ReportDialog open onOpenChange={() => undefined} />);

  expect(screen.getByRole("dialog")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Submit report" })).toBeDisabled();
  expect(screen.getByText(/not submitted/i)).toBeInTheDocument();
});

test("error states can be retried", async () => {
  const user = userEvent.setup({ pointerEventsCheck: PointerEventsCheckLevel.Never });
  const onRetry = vi.fn();

  render(<ErrorState onRetry={onRetry} />);
  await user.click(screen.getByRole("button", { name: "Try again" }));

  expect(onRetry).toHaveBeenCalledOnce();
});

test("onboarding can move through steps without saving", async () => {
  const user = userEvent.setup({ pointerEventsCheck: PointerEventsCheckLevel.Never });

  render(<OnboardingPreview />);

  await user.click(screen.getByRole("button", { name: "Next" }));
  expect(screen.getByText("Enter a display name.")).toBeInTheDocument();

  await user.type(screen.getByLabelText("Display name"), "Casey Morgan");
  await user.click(screen.getByRole("button", { name: "Next" }));
  expect(screen.getByText(/does not prove enrolment/i)).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "Skip" }));
  expect(screen.getByRole("heading", { name: "Interests" })).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "Next" }));
  expect(screen.getByText(/Campus days stay private/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Finish" })).toBeDisabled();
  expect(screen.getByText(/Nothing is saved/i)).toBeInTheDocument();
});
