
"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  campusDayOptions,
  courseOptions,
  interestOptions,
  meetupSpotOptions,
} from "@/features/prototype/data";
import { usePrototype } from "@/features/prototype/store";

function SetupFrame({
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
    <main id="main" className="flex w-full flex-col gap-6">
      <div>
        <p className="text-sm font-medium text-muted-foreground">
          Step {step} of 4
        </p>

        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          {title}
        </h1>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {body}
        </p>
      </div>

      {children}
    </main>
  );
}

function ChoiceList({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string;
  options: readonly string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div
      className="flex flex-wrap gap-2"
      role="group"
      aria-label={label}
    >
      {options.map((option) => {
        const active = selected.includes(option);

        return (
          <button
            key={option}
            type="button"
            aria-pressed={active}
            onClick={() => onToggle(option)}
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
  );
}

function toggleValue(current: string[], value: string) {
  return current.includes(value)
    ? current.filter((item) => item !== value)
    : [...current, value];
}

// --------------------------------------------------
// STEP 2 — COURSES
// --------------------------------------------------

export function CoursesSetupScreen() {
  const router = useRouter();
  const { setCourses } = usePrototype();

  const [selected, setSelected] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [customCourse, setCustomCourse] = useState("");

  function addCustomCourse() {
    const value = customCourse.trim().toUpperCase();

    if (!value) {
      setError("Enter a course code from the supported prototype list.");
      return;
    }

    if (!courseOptions.some((course) => course === value)) {
      setError("Course not found in this prototype catalogue. Select a listed course instead.");
      return;
    }

    if (!selected.includes(value)) {
      setSelected((current) => [...current, value]);
    }

    setCustomCourse("");
    setError("");
  }

  function continueSetup() {
    if (selected.length === 0) {
      setError("Choose at least one course.");
      return;
    }

    setCourses(selected);
    router.push("/setup/interests");
  }

  return (
    <SetupFrame
      step={2}
      title="Select current courses"
      body="Select your current courses from the supported prototype catalogue. You can enter a supported course code below. This is a limited demonstration list, not the full university catalogue, and enrolment is not verified."
    >
      <ChoiceList
        label="Current courses"
        options={courseOptions}
        selected={selected}
        onToggle={(value) => {
          setSelected((current) => toggleValue(current, value));
          setError("");
        }}
      />

      <p className="text-xs text-muted-foreground">Only codes shown in the list above can be added. If your course is missing, choose another listed course for this prototype.</p>
      <div className="flex gap-2">
        <Input
          aria-label="Enter supported course code"
          placeholder="Supported course code (e.g. COMP261)"
          value={customCourse}
          onChange={(e) => setCustomCourse(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addCustomCourse();
            }
          }}
        />

        <Button
          type="button"
          variant="outline"
          onClick={addCustomCourse}
        >
          Add
        </Button>
      </div>

      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <div className="flex gap-2">
        <Button asChild variant="outline">
          <Link href="/sign-in">Back</Link>
        </Button>

        <Button type="button" onClick={continueSetup}>
          Continue
        </Button>
      </div>
    </SetupFrame>
  );
}

// --------------------------------------------------
// STEP 3 — INTERESTS
// --------------------------------------------------

export function InterestsSetupScreen() {
  const router = useRouter();
  const { setInterests } = usePrototype();

  const [selected, setSelected] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [customInterest, setCustomInterest] = useState("");

  function addCustomInterest() {
    const value = customInterest.trim();

    if (!value) return;

    const alreadySelected = selected.some(
      (interest) =>
        interest.toLowerCase() === value.toLowerCase()
    );

    if (!alreadySelected) {
      setSelected((current) => [...current, value]);
    }

    setCustomInterest("");
    setError("");
  }

  function continueSetup() {
    if (selected.length === 0) {
      setError("Choose at least one interest.");
      return;
    }

    setInterests(selected);
    router.push("/setup/campus");
  }

  return (
    <SetupFrame
      step={3}
      title="Pick interests and hobbies"
      body="Choose interests that describe you. Other students can see shared interests to start conversations. These are not a calculated compatibility score."
    >
      <ChoiceList
        label="Interests and hobbies"
        options={interestOptions}
        selected={selected}
        onToggle={(value) => {
          setSelected((current) => toggleValue(current, value));
          setError("");
        }}
      />

      <div className="flex gap-2">
        <Input
          aria-label="Add another interest"
          placeholder="Add your own interest"
          value={customInterest}
          onChange={(e) => setCustomInterest(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addCustomInterest();
            }
          }}
        />

        <Button
          type="button"
          variant="outline"
          onClick={addCustomInterest}
        >
          Add
        </Button>
      </div>

      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <div className="flex gap-2">
        <Button asChild variant="outline">
          <Link href="/setup/courses">Back</Link>
        </Button>

        <Button type="button" onClick={continueSetup}>
          Continue
        </Button>
      </div>
    </SetupFrame>
  );
}

// --------------------------------------------------
// STEP 4 — CAMPUS DAYS AND MEETUP SPOTS
// --------------------------------------------------

function campusSummary(days: string[]) {
  const shorts = campusDayOptions
    .filter((day) => days.includes(day.id))
    .map((day) => day.short);

  if (shorts.length === 0) return "";

  if (shorts.length === campusDayOptions.length) {
    return "Any day";
  }

  return `${shorts.join("/")} only`;
}

export function CampusSetupScreen() {
  const router = useRouter();
  const { setCampusPlan } = usePrototype();

  const [days, setDays] = useState<string[]>([]);
  const [spots, setSpots] = useState<string[]>([]);
  const [error, setError] = useState("");

  const summary = campusSummary(days);

  function finish() {
    if (days.length === 0 || spots.length === 0) {
      setError(
        "Choose at least one campus day and one meet-up spot."
      );
      return;
    }

    setCampusPlan(days, spots);
    router.push("/home");
  }

  return (
    <SetupFrame
      step={4}
      title="Set campus days and meet-up spots"
      body="Choose the days you normally attend campus, then select public places where you would feel comfortable meeting someone. These are preferences, not scheduled meetups; campus-day visibility is controlled in Privacy."
    >
      <div className="flex flex-col gap-3">
        <h2 className="text-base font-semibold">
          Days I am usually on campus
        </h2>

        <ChoiceList
          label="Campus days"
          options={campusDayOptions.map((day) => day.id)}
          selected={days}
          onToggle={(value) => {
            setDays((current) => toggleValue(current, value));
            setError("");
          }}
        />

        {summary ? (
          <p className="text-sm text-muted-foreground">
            {summary}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-base font-semibold">
          Public places I prefer for meetups
        </h2>

        <ChoiceList
          label="Meet-up spots"
          options={meetupSpotOptions}
          selected={spots}
          onToggle={(value) => {
            setSpots((current) => toggleValue(current, value));
            setError("");
          }}
        />
      </div>

      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <div className="flex gap-2">
        <Button asChild variant="outline">
          <Link href="/setup/interests">Back</Link>
        </Button>

        <Button type="button" onClick={finish}>
          Finish setup
        </Button>
      </div>
    </SetupFrame>
  );
}
