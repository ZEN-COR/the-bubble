"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { courseOptions, interestOptions, personById, prototypePeople } from "@/features/prototype/data";
import { usePrototype } from "@/features/prototype/store";

const meetingPatterns = ["One-off sessions", "Weeknights", "Weekends", "Weekly"] as const;

function Step({
  step,
  title,
  body,
  children,
}: {
  step: number;
  title: string;
  body: string;
  children: ReactNode;
}) {
  return (
    <main id="main" className="mx-auto flex w-full max-w-lg flex-col gap-6 px-4 py-6">
      <div>
        <p className="text-sm font-medium text-muted-foreground">Step {step} of 4</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
      </div>
      {children}
    </main>
  );
}

function toggle(current: string[], value: string) {
  return current.includes(value) ? current.filter((item) => item !== value) : [...current, value];
}

export function StartGroupTopicScreen() {
  const router = useRouter();
  const { setGroupTopic } = usePrototype();
  const [topic, setTopic] = useState("");
  const [error, setError] = useState("");

  function continueSetup() {
    if (!topic) {
      setError("Choose a course or an interest.");
      return;
    }
    setGroupTopic(topic);
    router.push("/groups/start/pattern");
  }

  return (
    <Step
      step={1}
      title="Start a group"
      body="Choose one course or interest from this prototype. This does not create a live club."
    >
      <div className="flex flex-col gap-3">
        <h2 className="text-base font-semibold">Courses</h2>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Courses">
          {courseOptions.map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={topic === option}
              onClick={() => {
                setTopic(option);
                setError("");
              }}
              className={
                topic === option
                  ? "min-h-11 rounded-full bg-accent px-4 text-sm font-semibold text-accent-foreground"
                  : "min-h-11 rounded-full bg-card px-4 text-sm font-semibold text-muted-foreground shadow-[var(--shadow-card)]"
              }
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <h2 className="text-base font-semibold">Interests</h2>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Interests">
          {interestOptions.map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={topic === option}
              onClick={() => {
                setTopic(option);
                setError("");
              }}
              className={
                topic === option
                  ? "min-h-11 rounded-full bg-accent px-4 text-sm font-semibold text-accent-foreground"
                  : "min-h-11 rounded-full bg-card px-4 text-sm font-semibold text-muted-foreground shadow-[var(--shadow-card)]"
              }
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
      <div className="flex gap-2">
        <Button asChild variant="outline">
          <Link href="/groups">Back</Link>
        </Button>
        <Button type="button" onClick={continueSetup}>
          Continue
        </Button>
      </div>
    </Step>
  );
}

export function StartGroupPatternScreen() {
  const router = useRouter();
  const { state, setGroupPattern } = usePrototype();
  const [pattern, setPattern] = useState<string[]>(state.groupDraft.pattern);
  const [error, setError] = useState("");

  function continueSetup() {
    if (pattern.length === 0) {
      setError("Choose at least one meeting pattern.");
      return;
    }
    setGroupPattern(pattern);
    router.push("/groups/start/access");
  }

  return (
    <Step
      step={2}
      title="Set a meeting pattern"
      body="Pick what fits. One-off sessions and weeknights can be chosen together."
    >
      <div className="flex flex-wrap gap-2" role="group" aria-label="Meeting pattern">
        {meetingPatterns.map((option) => {
          const active = pattern.includes(option);
          return (
            <button
              key={option}
              type="button"
              aria-pressed={active}
              onClick={() => {
                setPattern((current) => toggle(current, option));
                setError("");
              }}
              className={
                active
                  ? "min-h-11 rounded-full bg-accent px-4 text-sm font-semibold text-accent-foreground"
                  : "min-h-11 rounded-full bg-card px-4 text-sm font-semibold text-muted-foreground shadow-[var(--shadow-card)]"
              }
            >
              {option}
            </button>
          );
        })}
      </div>
      {pattern.length > 0 ? (
        <p className="text-sm text-muted-foreground">{pattern.join(", ")}</p>
      ) : null}
      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
      <div className="flex gap-2">
        <Button asChild variant="outline">
          <Link href="/groups/start">Back</Link>
        </Button>
        <Button type="button" onClick={continueSetup}>
          Continue
        </Button>
      </div>
    </Step>
  );
}

export function StartGroupAccessScreen() {
  const router = useRouter();
  const { state, setGroupAccess } = usePrototype();
  const [openToNew, setOpenToNew] = useState(state.groupDraft.openToNew);
  const [partTimeOrReturning, setPartTimeOrReturning] = useState(
    state.groupDraft.partTimeOrReturning,
  );

  function continueSetup() {
    setGroupAccess(openToNew, partTimeOrReturning);
    router.push("/groups/start/invite");
  }

  return (
    <Step
      step={3}
      title="Who can join"
      body="Both choices are optional. They stay with this group for the current visit."
    >
      <label className="flex min-h-11 items-start gap-3 rounded-[20px] bg-card p-4 shadow-[var(--shadow-card)]">
        <input
          type="checkbox"
          className="mt-1 size-4"
          checked={openToNew}
          onChange={(event) => setOpenToNew(event.target.checked)}
        />
        <span>
          <span className="font-medium">Open to new members</span>
          <span className="mt-1 block text-sm text-muted-foreground">
            Other students can ask to join. This prototype does not publish the group.
          </span>
        </span>
      </label>
      <label className="flex min-h-11 items-start gap-3 rounded-[20px] bg-card p-4 shadow-[var(--shadow-card)]">
        <input
          type="checkbox"
          className="mt-1 size-4"
          checked={partTimeOrReturning}
          onChange={(event) => setPartTimeOrReturning(event.target.checked)}
        />
        <span>
          <span className="font-medium">Part-time or returning students</span>
          <span className="mt-1 block text-sm text-muted-foreground">
            Say the group welcomes part-time or returning students.
          </span>
        </span>
      </label>
      <div className="flex gap-2">
        <Button asChild variant="outline">
          <Link href="/groups/start/pattern">Back</Link>
        </Button>
        <Button type="button" onClick={continueSetup}>
          Continue
        </Button>
      </div>
    </Step>
  );
}

export function StartGroupInviteScreen() {
  const router = useRouter();
  const { state, inviteToGroup, finishGroup } = usePrototype();
  const topic = state.groupDraft.topic;
  const matches = prototypePeople.filter(
    (person) => person.tags.some((tag) => tag === topic) && !state.blocked.includes(person.id),
  );

  function finish() {
    finishGroup();
    router.push("/groups");
  }

  if (!topic) {
    return (
      <Step step={4} title="Invite students" body="Choose a course or interest before sending invites.">
        <Button asChild>
          <Link href="/groups/start">Choose a topic</Link>
        </Button>
      </Step>
    );
  }

  return (
    <Step
      step={4}
      title="Invite students"
      body={`Students in this prototype who list ${topic}. Invites stay in this browser.`}
    >
      {matches.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No one in this prototype lists {topic} yet. You can still keep the group.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {matches.map((person) => {
            const invited = state.groupDraft.invites.includes(person.id);
            const profile = personById(person.id);
            return (
              <li
                key={person.id}
                className="flex items-center justify-between gap-3 rounded-[20px] bg-card p-4 shadow-[var(--shadow-card)]"
              >
                <div>
                  <p className="font-semibold">{person.displayName}</p>
                  <p className="text-sm text-muted-foreground">
                    {[profile?.major, profile?.year].filter(Boolean).join(" · ")}
                  </p>
                </div>
                <Button type="button" disabled={invited} onClick={() => inviteToGroup(person.id)}>
                  {invited ? "Invited" : "Invite"}
                </Button>
              </li>
            );
          })}
        </ul>
      )}
      <div className="flex gap-2">
        <Button asChild variant="outline">
          <Link href="/groups/start/access">Back</Link>
        </Button>
        <Button type="button" onClick={finish}>
          Done
        </Button>
      </div>
    </Step>
  );
}
