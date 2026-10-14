"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { PlaceholderArt, sceneFromText } from "@/components/brand/placeholder-art";
import { portraitUrl } from "@/lib/portraits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RequestDialog } from "@/features/connections/request-dialog";
import { EventCard } from "@/features/events/event-card";
import { GroupCard } from "@/features/groups/group-card";
import { ConversationPanel } from "@/features/messages/conversation-panel";
import { OnboardingPreview } from "@/features/onboarding/onboarding-preview";
import { PersonCard } from "@/features/people/person-card";
import {
  eventById,
  eventFilters,
  groupById,
  meetupSuggestion,
  personById,
  prototypeEvents,
  prototypeGroups,
  viewer,
} from "@/features/prototype/data";
import { usePrototype } from "@/features/prototype/store";
import { ReportDialog } from "@/features/safety/report-dialog";

function Screen({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <main id="main" className="mx-auto flex w-full max-w-lg flex-col gap-6 px-4 py-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {action}
      </div>
      {children}
    </main>
  );
}

function FilterRow({
  options,
  value,
  onChange,
}: {
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Filters">
      {options.map((option) => {
        const selected = value === option;
        return (
          <button
            key={option}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(option)}
            className={
              selected
                ? "min-h-11 shrink-0 rounded-full bg-accent px-4 text-sm font-semibold text-accent-foreground"
                : "min-h-11 shrink-0 rounded-full bg-card px-4 text-sm font-semibold text-muted-foreground shadow-[var(--shadow-card)]"
            }
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

export function SignInScreen() {
  const router = useRouter();

  return (
    <main id="main" className="flex w-full flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          The prototype skips email delivery. Use either path to click through the app.
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <Button type="button" onClick={() => router.push("/verify")}>
          Email me a sign-in link
        </Button>
        <Button type="button" variant="secondary" onClick={() => router.push("/people")}>
          Enter the prototype
        </Button>
      </div>
    </main>
  );
}

export function VerifyScreen() {
  return (
    <main id="main" className="flex w-full flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Check your email</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          In the real app this waits for a confirmed university email. Here you can continue
          straight away.
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <Button asChild>
          <Link href="/onboarding">Set up your profile</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/people">Skip to people</Link>
        </Button>
      </div>
    </main>
  );
}

export function OnboardingScreen() {
  const router = useRouter();
  const { setDisplayName } = usePrototype();

  return (
    <main id="main" className="w-full">
      <OnboardingPreview
        onFinish={(name) => {
          setDisplayName(name);
          router.push("/people");
        }}
      />
    </main>
  );
}

const discoveryFilters = ["For you", "Same courses", "On campus", "Shared interests"] as const;
const crowdTones = ["bg-[#f4ad91]/55", "bg-[#e8dafa]", "bg-[#f4d77d]/80"] as const;

export function PeopleScreen() {
  const router = useRouter();
  const { people, pendingCount, relation, sendRequest } = usePrototype();
  const [filter, setFilter] = useState<(typeof discoveryFilters)[number]>("For you");
  const [query, setQuery] = useState("");
  const [requestId, setRequestId] = useState<string | null>(null);
  const requestPerson = requestId ? personById(requestId) : undefined;

  const visible = people.filter((person) => {
    const haystack = [
      person.displayName,
      person.degree,
      person.major,
      person.year,
      person.bio,
      person.explanation,
      ...person.tags,
    ]
      .join(" ")
      .toLowerCase();
    const matchesQuery = haystack.includes(query.trim().toLowerCase());
    const matchesFilter =
      filter === "For you" ||
      (filter === "Same courses" &&
        person.filters.some((item) => viewer.courses.some((course) => course === item))) ||
      (filter === "On campus" &&
        person.tags.some((tag) => viewer.campusDays.some((day) => day === tag))) ||
      (filter === "Shared interests" &&
        person.tags.some((tag) => viewer.interests.some((interest) => interest === tag)));
    return matchesQuery && matchesFilter;
  });

  return (
    <Screen
      title="Find your people"
      action={
        <Button asChild variant="outline">
          <Link href="/connections">
            Requests{pendingCount > 0 ? ` (${pendingCount})` : ""}
          </Link>
        </Button>
      }
    >
      <p className="-mt-4 text-sm text-muted-foreground">
        Good connections start somewhere. <span aria-hidden="true">✨</span>
      </p>
      <Label htmlFor="people-search" className="sr-only">
        Search people, interests, and courses
      </Label>
      <Input
        id="people-search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search people, interests, courses..."
      />
      <FilterRow
        options={discoveryFilters}
        value={filter}
        onChange={(value) => setFilter(value as typeof filter)}
      />
      <h2 className="text-base font-semibold">People you might click with</h2>
      {visible.length === 0 ? (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-muted-foreground">
            No one matches that search. Try a course, an interest, or a campus day, or clear the
            filters.
          </p>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              setQuery("");
              setFilter("For you");
            }}
          >
            Clear filters
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {visible.map((person, index) => {
            const status = relation(person.id);
            return (
              <div key={person.id} className="bubble-rise" style={{ animationDelay: `${index * 60}ms` }}>
              <PersonCard
                id={person.id}
                displayName={person.displayName}
                degree={person.degree}
                major={person.major}
                year={person.year}
                sharedTags={[...person.tags]}
                explanation={person.explanation}
                icebreaker={status === "none" ? person.starter : undefined}
                portraitSrc={portraitUrl(person.portrait)}
                profileHref={`/people/${person.id}`}
                actionLabel={
                  status === "connected"
                    ? "Message"
                    : status === "sent"
                      ? "Requested"
                      : status === "incoming"
                        ? "Respond"
                        : "Say hello"
                }
                unavailableLabel={
                  status === "sent" ? "Request already sent." : undefined
                }
                onAction={
                  status === "connected"
                    ? () => router.push(`/messages/${person.id}`)
                    : status === "incoming"
                      ? () => router.push("/connections")
                      : status === "sent"
                        ? undefined
                        : () => setRequestId(person.id)
                }
              />
              </div>
            );
          })}
        </div>
      )}
      <section className="flex flex-col gap-3" aria-labelledby="crowd-heading">
        <div>
          <h2 id="crowd-heading" className="text-base font-semibold">
            Find your crowd
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Groups already in this prototype. These are not live club memberships.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {prototypeGroups.map((group, index) => (
            <Link
              key={group.id}
              href={`/groups/${group.id}`}
              className={`flex min-h-28 flex-col justify-end rounded-[22px] p-3 text-sm font-semibold text-[#25332c] ${crowdTones[index % crowdTones.length]}`}
            >
              {group.name}
            </Link>
          ))}
        </div>
      </section>
      {requestPerson ? (
        <RequestDialog
          recipientName={requestPerson.displayName}
          open
          onOpenChange={(open) => {
            if (!open) setRequestId(null);
          }}
          defaultOpener={requestPerson.starter}
          onSend={(opener) => sendRequest(requestPerson.id, opener)}
        />
      ) : null}
    </Screen>
  );
}

export function PersonScreen({ id }: { id: string }) {
  const person = personById(id);
  const { relation, sendRequest, block, state, report } = usePrototype();
  const [requestOpen, setRequestOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  if (!person || state.blocked.includes(id)) {
    return (
      <Screen title="Profile">
        <p className="text-sm leading-6 text-muted-foreground">
          This profile is not in the prototype.
        </p>
      </Screen>
    );
  }

  const status = relation(id);

  return (
    <Screen title={person.displayName}>
      <PlaceholderArt bleed={false} scene={sceneFromText(person.tags.join(" "))} />
      <img
        src={portraitUrl(person.portrait)}
        alt=""
        className="size-16 rounded-full object-cover"
      />
      <p className="text-sm text-muted-foreground">
        {[person.degree, person.major, person.year].filter(Boolean).join(", ")}
      </p>
      <p>{person.bio}</p>
      <p className="font-medium">{person.explanation}</p>
      <ul aria-label="Shared tags" className="flex flex-wrap gap-2 text-sm">
        {person.tags.map((tag) => (
          <li key={tag} className="rounded-full bg-secondary px-3 py-1">
            {tag}
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-2">
        {status === "connected" ? (
          <Button asChild>
            <Link href={`/messages/${person.id}`}>Message</Link>
          </Button>
        ) : status === "sent" ? (
          <Button type="button" disabled>
            Requested
          </Button>
        ) : (
          <Button type="button" onClick={() => setRequestOpen(true)}>
            Say hello
          </Button>
        )}
        <Button type="button" variant="outline" onClick={() => setReportOpen(true)}>
          Report
        </Button>
        <Button type="button" variant="ghost" onClick={() => block(person.id)}>
          Block
        </Button>
      </div>
      <RequestDialog
        recipientName={person.displayName}
        open={requestOpen}
        onOpenChange={setRequestOpen}
        defaultOpener={person.starter}
        onSend={(opener) => sendRequest(person.id, opener)}
      />
      <ReportDialog
        open={reportOpen}
        onOpenChange={setReportOpen}
        onSubmit={(reason) => report(person.displayName, reason)}
      />
    </Screen>
  );
}

export function ConnectionsScreen() {
  const { state, accept, decline, previewAccept } = usePrototype();
  const incoming = Object.entries(state.incoming).filter(
    ([id, request]) => request.status === "pending" && !state.blocked.includes(id),
  );
  const sent = Object.entries(state.sent).filter(([id]) => !state.blocked.includes(id));
  const connected = state.connected
    .filter((id) => !state.blocked.includes(id))
    .map((id) => personById(id))
    .filter((person) => person !== undefined);

  return (
    <Screen title="Connections">
      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-medium">For you</h2>
        {incoming.length === 0 ? (
          <p className="text-sm text-muted-foreground">No pending requests.</p>
        ) : (
          incoming.map(([id, request]) => {
            const person = personById(id);
            if (!person) return null;
            return (
              <article key={id} className="rounded-[20px] bg-card p-4 shadow-[var(--shadow-card)]">
                <h3 className="font-medium">{person.displayName}</h3>
                <p className="mt-1 text-sm leading-6">{request.opener}</p>
                <div className="mt-3 flex gap-2">
                  <Button type="button" onClick={() => accept(id)}>
                    Accept
                  </Button>
                  <Button type="button" variant="outline" onClick={() => decline(id)}>
                    Decline
                  </Button>
                </div>
              </article>
            );
          })
        )}
      </section>
      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-medium">Sent</h2>
        {sent.length === 0 ? (
          <p className="text-sm text-muted-foreground">You have not sent a request.</p>
        ) : (
          sent.map(([id, opener]) => {
            const person = personById(id);
            return (
              <article key={id} className="rounded-[20px] bg-card p-4 shadow-[var(--shadow-card)]">
                <p className="text-sm">
                  Waiting on {person?.displayName ?? "someone"}
                  {opener ? `: ${opener}` : "."}
                </p>
                <Button type="button" className="mt-3" onClick={() => previewAccept(id)}>
                  Preview acceptance
                </Button>
              </article>
            );
          })
        )}
      </section>
      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-medium">Connected</h2>
        {connected.map((person) => (
          <Link key={person.id} href={`/messages/${person.id}`} className="min-h-11 font-medium underline">
            Message {person.displayName}
          </Link>
        ))}
      </section>
    </Screen>
  );
}

export function EventsScreen() {
  const { state, rsvp } = usePrototype();
  const [filter, setFilter] = useState<(typeof eventFilters)[number]>("All");
  const visible = prototypeEvents.filter(
    (event) => filter === "All" || event.filters.some((item) => item === filter),
  );

  return (
    <Screen title="Events">
      <FilterRow options={eventFilters} value={filter} onChange={(value) => setFilter(value as typeof filter)} />
      {visible.length === 0 ? (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-muted-foreground">No events match those filters.</p>
          <Button type="button" variant="secondary" onClick={() => setFilter("All")}>
            Clear filters
          </Button>
        </div>
      ) : (
      <div className="flex flex-col gap-3">
        {visible.map((event) => (
          <EventCard
            key={event.id}
            id={event.id}
            title={event.title}
            startsAtLabel={event.startsAtLabel}
            locationLabel={event.locationLabel}
            relevance={event.relevance}
            organizerVerified={event.organizerVerified}
            href={`/events/${event.id}`}
            going={state.rsvps[event.id] === "going"}
            onGoing={() => rsvp(event.id, state.rsvps[event.id] === "going" ? "not_going" : "going")}
          />
        ))}
      </div>
      )}
    </Screen>
  );
}

export function EventScreen({ id }: { id: string }) {
  const event = eventById(id);
  const { state, rsvp } = usePrototype();
  if (!event) {
    return (
      <Screen title="Event">
        <p className="text-sm text-muted-foreground">This event is not in the prototype.</p>
      </Screen>
    );
  }
  const going = state.rsvps[id] === "going";

  return (
    <Screen title={event.title}>
      <PlaceholderArt bleed={false} scene={sceneFromText(`${event.title} ${event.relevance}`)} />
      <p className="text-sm text-muted-foreground">
        {event.startsAtLabel} to {event.endsAtLabel}
      </p>
      <p>{event.locationLabel}</p>
      <p>{event.summary}</p>
      <p className="font-medium">{event.relevance}</p>
      <p className="text-sm">Student-created by {event.organizer}. Not a verified organizer.</p>
      <div className="flex gap-2">
        <Button type="button" variant={going ? "secondary" : "default"} onClick={() => rsvp(id, "going")}>
          {going ? "You are going" : "RSVP going"}
        </Button>
        <Button type="button" variant="outline" onClick={() => rsvp(id, "not_going")}>
          Not going
        </Button>
      </div>
      <section>
        <h2 className="text-lg font-medium">Visible attendees</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Only people who chose to be shown are listed. Hidden RSVPs stay hidden.
        </p>
        <ul className="mt-2 flex flex-col gap-2">
          {event.visibleAttendees.map((attendeeId) => {
            const attendee = personById(attendeeId);
            if (!attendee) return null;
            return (
              <li key={attendeeId}>
                <Link href={`/people/${attendee.id}`} className="font-medium underline">
                  {attendee.displayName}
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </Screen>
  );
}

export function GroupsScreen() {
  const { state, toggleGroup } = usePrototype();

  return (
    <Screen title="Groups">
      <div className="flex flex-col gap-3">
        {prototypeGroups.map((group) => {
          const joined = state.groups.includes(group.id);
          return (
            <GroupCard
              key={group.id}
              id={group.id}
              name={group.name}
              description={group.description}
              memberCount={group.memberCount + (joined ? 1 : 0)}
              href={`/groups/${group.id}`}
              joined={joined}
              joinLabel={
                group.privacy === "invite" ? (joined ? "Leave" : "Accept invite") : undefined
              }
              onJoin={() => toggleGroup(group.id)}
            />
          );
        })}
      </div>
    </Screen>
  );
}

export function GroupScreen({ id }: { id: string }) {
  const group = groupById(id);
  const { state, toggleGroup } = usePrototype();
  if (!group) {
    return (
      <Screen title="Group">
        <p className="text-sm text-muted-foreground">This group is not in the prototype.</p>
      </Screen>
    );
  }
  const joined = state.groups.includes(id);
  const event = group.eventId ? eventById(group.eventId) : undefined;

  return (
    <Screen title={group.name}>
      <PlaceholderArt bleed={false} scene={sceneFromText(`${group.name} ${group.description}`)} />
      <p className="text-sm text-muted-foreground">
        {group.privacy === "invite" ? "Private, invitation preview" : "Public group"}
      </p>
      <p>{group.description}</p>
      <Button type="button" onClick={() => toggleGroup(id)}>
        {joined ? "Leave" : group.privacy === "invite" ? "Accept invite" : "Join"}
      </Button>
      <section>
        <h2 className="text-lg font-medium">Members who opted in</h2>
        <ul className="mt-2 list-disc pl-5">
          {group.members.map((name) => (
            <li key={name}>{name}</li>
          ))}
          {joined ? <li>{state.displayName}</li> : null}
        </ul>
      </section>
      {event ? (
        <Link href={`/events/${event.id}`} className="min-h-11 font-medium underline">
          {event.title}
        </Link>
      ) : null}
    </Screen>
  );
}

export function MessagesScreen() {
  const { state } = usePrototype();
  const chats = state.connected
    .filter((id) => !state.blocked.includes(id))
    .map((id) => {
      const person = personById(id);
      const thread = state.threads[id] ?? [];
      const last = thread[thread.length - 1];
      return person
        ? { person, preview: last?.body ?? "Say hello" }
        : null;
    })
    .filter((chat) => chat !== null);

  return (
    <Screen title="Messages">
      {chats.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Messages appear after you accept a connection.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {chats.map((chat) => (
            <li key={chat.person.id}>
              <Link
                href={`/messages/${chat.person.id}`}
                className="flex min-h-11 items-center gap-3 rounded-[20px] bg-card px-4 py-3 shadow-[var(--shadow-card)]"
              >
                <img
                  src={portraitUrl(chat.person.portrait)}
                  alt=""
                  className="size-11 rounded-full object-cover"
                />
                <span className="flex flex-col">
                <span className="font-medium">{chat.person.displayName}</span>
                <span className="text-sm text-muted-foreground">{chat.preview}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Screen>
  );
}

export function ChatScreen({ id }: { id: string }) {
  const person = personById(id);
  const { state, sendMessage } = usePrototype();
  const connected = state.connected.includes(id) && !state.blocked.includes(id);

  if (!person || !connected) {
    return (
      <Screen title="Chat">
        <p className="text-sm leading-6 text-muted-foreground">
          Chat opens after you both accept a connection.
        </p>
        <Button asChild variant="outline">
          <Link href="/people">Back to people</Link>
        </Button>
      </Screen>
    );
  }

  const messages = (state.threads[id] ?? []).map((message) => ({
    id: message.id,
    senderName: message.from === "you" ? state.displayName : person.displayName,
    body: message.body,
    sentAt: "2026-11-03T04:12:00.000Z",
    sentAtLabel: message.time,
  }));

  return (
    <Screen title={person.displayName}>
      <img
        src={portraitUrl(person.portrait)}
        alt=""
        className="size-16 rounded-full object-cover"
      />
      <ConversationPanel
        messages={messages}
        suggestions={[{ label: "Suggest a campus time", body: meetupSuggestion }]}
        onSend={(body) => sendMessage(id, body)}
      />
    </Screen>
  );
}

export function CalendarScreen() {
  const { state } = usePrototype();
  const going = prototypeEvents.filter((event) => state.rsvps[event.id] === "going");

  return (
    <Screen title="Calendar">
      <p className="text-sm text-muted-foreground">Times are shown in Pacific/Auckland.</p>
      {going.length === 0 ? (
        <p className="text-sm text-muted-foreground">RSVP to an event and it will show up here.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {going.map((event) => (
            <li key={event.id} className="rounded-[20px] bg-card p-4 shadow-[var(--shadow-card)]">
              <Link href={`/events/${event.id}`} className="font-medium hover:underline">
                {event.title}
              </Link>
              <p className="text-sm text-muted-foreground">{event.startsAtLabel}</p>
              <p className="text-sm">{event.locationLabel}</p>
            </li>
          ))}
        </ul>
      )}
    </Screen>
  );
}

export function ProfileScreen() {
  const { state } = usePrototype();

  return (
    <Screen title="Your profile">
      {state.displayName === viewer.displayName ? (
        <img
          src={portraitUrl(viewer.portrait)}
          alt=""
          className="size-16 rounded-full object-cover"
        />
      ) : null}
      <p className="text-2xl font-medium">{state.displayName}</p>
      <p className="text-sm text-muted-foreground">
        {viewer.degree}, {viewer.major}
      </p>
      <p>Courses: {viewer.courses.join(", ")}</p>
      <p>Interests: {viewer.interests.join(", ")}</p>
      <p>Campus days shared: {state.shareCampusDays ? viewer.campusDays.join(", ") : "Hidden"}</p>
      <p>Discovery: {state.discoverable ? "On" : "Off"}</p>
      <div className="flex flex-wrap gap-2">
        <Button asChild variant="outline">
          <Link href="/settings/privacy">Privacy</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/settings/notifications">Notifications</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/report">Report</Link>
        </Button>
      </div>
    </Screen>
  );
}

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex min-h-11 items-start gap-3 rounded-[20px] bg-card p-4 shadow-[var(--shadow-card)]">
      <input
        type="checkbox"
        className="mt-1 size-4"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span>
        <span className="font-medium">{label}</span>
        <span className="mt-1 block text-sm text-muted-foreground">{description}</span>
      </span>
    </label>
  );
}

export function PrivacyScreen() {
  const { state, setDiscoverable, setShareCampusDays, setLifeStageOptIn } = usePrototype();

  return (
    <Screen title="Privacy">
      <Toggle
        label="Appear in discovery"
        description="Off hides you from search. People you already connected with can still message you in this prototype."
        checked={state.discoverable}
        onChange={setDiscoverable}
      />
      <Toggle
        label="Share campus-day overlap"
        description="Other students only learn that a day overlaps. They never see the raw list."
        checked={state.shareCampusDays}
        onChange={setShareCampusDays}
      />
      <Toggle
        label="Show life-stage tag"
        description="Optional. Hidden unless you opt in."
        checked={state.lifeStageOptIn}
        onChange={setLifeStageOptIn}
      />
    </Screen>
  );
}

export function NotificationsScreen() {
  const { state, setAlert } = usePrototype();

  return (
    <Screen title="Notifications">
      <Toggle
        label="Event alerts"
        description="Reminders for events you are going to."
        checked={state.alerts.events}
        onChange={(value) => setAlert("events", value)}
      />
      <Toggle
        label="Connection alerts"
        description="When someone sends or accepts a request."
        checked={state.alerts.connections}
        onChange={(value) => setAlert("connections", value)}
      />
      <Toggle
        label="Message alerts"
        description="When a connection sends a chat."
        checked={state.alerts.messages}
        onChange={(value) => setAlert("messages", value)}
      />
    </Screen>
  );
}

export function ReportScreen() {
  const { people, report, state } = usePrototype();
  const [subject, setSubject] = useState<string>(people[0]?.displayName ?? "");
  const [reason, setReason] = useState("Spam");
  const [done, setDone] = useState(false);

  return (
    <Screen title="Report">
      <p className="text-sm leading-6 text-muted-foreground">
        The receipt stays in this browser. The reported person does not see it.
      </p>
      <Label htmlFor="report-subject">Person</Label>
      <select
        id="report-subject"
        value={subject}
        onChange={(event) => setSubject(event.target.value)}
        className="h-11 rounded-lg border border-input bg-transparent px-3"
      >
        {people.map((person) => (
          <option key={person.id}>{person.displayName}</option>
        ))}
      </select>
      <Label htmlFor="report-reason-page">Reason</Label>
      <select
        id="report-reason-page"
        value={reason}
        onChange={(event) => setReason(event.target.value)}
        className="h-11 rounded-lg border border-input bg-transparent px-3"
      >
        {["Harassment", "Impersonation", "Spam", "Inappropriate content", "Other"].map((item) => (
          <option key={item}>{item}</option>
        ))}
      </select>
      <Button
        type="button"
        onClick={() => {
          report(subject, reason);
          setDone(true);
        }}
      >
        Submit report
      </Button>
      {done ? (
        <p role="status" className="text-sm">
          Report received for {subject}. A moderator can see it in the prototype queue.
        </p>
      ) : null}
      {state.reports.length > 0 ? (
        <Link href="/admin/moderation" className="text-sm font-medium underline">
          Open the prototype moderation queue
        </Link>
      ) : null}
    </Screen>
  );
}

export function ModerationScreen() {
  const { state, setReportStatus } = usePrototype();

  return (
    <Screen title="Moderation">
      <p className="text-sm leading-6 text-muted-foreground">
        Prototype queue. This page is not access-controlled.
      </p>
      {state.reports.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No reports yet. Submit one from a profile or the report page.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {state.reports.map((item) => (
            <li key={item.id} className="rounded-[20px] bg-card p-4 shadow-[var(--shadow-card)]">
              <p className="font-medium">{item.subject}</p>
              <p className="text-sm">{item.reason}</p>
              <p className="text-sm text-muted-foreground">Status: {item.status}</p>
              <div className="mt-3 flex gap-2">
                <Button type="button" variant="outline" onClick={() => setReportStatus(item.id, "triaged")}>
                  Triage
                </Button>
                <Button type="button" onClick={() => setReportStatus(item.id, "resolved")}>
                  Resolve
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Screen>
  );
}
