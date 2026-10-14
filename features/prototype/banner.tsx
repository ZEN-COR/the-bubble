"use client";

import { usePrototype } from "@/features/prototype/store";

export function PrototypeBanner() {
  const { reset } = usePrototype();

  return (
    <div className="bg-accent px-4 py-2 text-sm text-accent-foreground">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
        <p>Design prototype. Fictional students. Reset clears this visit.</p>
        <button type="button" className="min-h-11 shrink-0 font-medium underline" onClick={reset}>
          Reset
        </button>
      </div>
    </div>
  );
}
