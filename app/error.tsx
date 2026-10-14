"use client";

import { Button } from "@/components/ui/button";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main id="main" className="mx-auto flex min-h-full w-full max-w-lg flex-col justify-center gap-4 px-4 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">Something went wrong</h1>
      <p className="text-sm leading-6 text-muted-foreground">
        This screen could not be shown. Your details were not displayed here.
      </p>
      <Button type="button" className="w-fit" onClick={reset}>
        Try again
      </Button>
    </main>
  );
}
