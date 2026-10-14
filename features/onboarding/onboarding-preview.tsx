"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { displayNameSchema } from "@/lib/validation/profile";

const steps = ["Name", "Courses", "Interests", "Privacy"] as const;

export function OnboardingPreview({
  onFinish,
}: {
  onFinish?: (displayName: string) => void;
}) {
  const [step, setStep] = useState(0);
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);

  function goBack() {
    setError(null);
    setStep((current) => Math.max(0, current - 1));
  }

  function goNext() {
    if (step === 0) {
      const parsed = displayNameSchema.safeParse(displayName);
      if (!parsed.success) {
        setError(parsed.error.issues[0]?.message ?? "Enter a display name.");
        return;
      }
    }

    setError(null);
    setStep((current) => Math.min(steps.length - 1, current + 1));
  }

  return (
    <section aria-labelledby="onboarding-title" className="flex flex-col gap-6">
      <div>
        <p className="text-sm font-medium text-muted-foreground">
          Step {step + 1} of {steps.length}
        </p>
        <h1 id="onboarding-title" className="mt-1 text-2xl font-semibold tracking-tight">
          {steps[step]}
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          This preview stays in your browser. Nothing is saved to an account.
        </p>
      </div>

      {step === 0 ? (
        <div className="flex flex-col gap-2">
          <Label htmlFor="display-name">Display name</Label>
          <Input
            id="display-name"
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            autoComplete="nickname"
            maxLength={40}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? "display-name-error" : undefined}
          />
          {error ? (
            <p id="display-name-error" className="text-sm text-destructive">
              {error}
            </p>
          ) : null}
        </div>
      ) : null}

      {step === 1 ? (
        <p className="text-sm leading-6">
          Course selection will be something you enter yourself. A verified email does not
          prove enrolment.
        </p>
      ) : null}

      {step === 2 ? (
        <p className="text-sm leading-6">
          Interests are optional. You will be able to skip them.
        </p>
      ) : null}

      {step === 3 ? (
        <div className="flex flex-col gap-4 text-sm leading-6">
          <label className="flex min-h-11 items-start gap-3">
            <input type="checkbox" disabled className="mt-1 size-4" />
            <span>
              <span className="font-medium">Appear in discovery</span>
              <span className="mt-1 block text-muted-foreground">
                Off by default. People cannot find you until you opt in.
              </span>
            </span>
          </label>
          <p>
            Campus days stay private. They are used only to say that a day overlaps, and only
            when you opt in.
          </p>
          <p>A life-stage tag is optional and hidden unless you explicitly opt in.</p>
        </div>
      ) : null}

      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={goBack} disabled={step === 0}>
          Back
        </Button>
        {step < steps.length - 1 ? (
          <Button type="button" variant="secondary" onClick={goNext}>
            Skip
          </Button>
        ) : (
          <Button type="button" variant="secondary" disabled>
            Skip
          </Button>
        )}
        {step < steps.length - 1 ? (
          <Button type="button" onClick={goNext}>
            Next
          </Button>
        ) : (
          <Button
            type="button"
            disabled={!onFinish}
            onClick={() => onFinish?.(displayName.trim() || "Alex Reed")}
          >
            Finish
          </Button>
        )}
      </div>
    </section>
  );
}
