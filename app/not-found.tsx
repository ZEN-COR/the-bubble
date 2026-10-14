import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main id="main" className="mx-auto flex min-h-full w-full max-w-lg flex-col justify-center gap-4 px-4 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">Page not found</h1>
      <p className="text-sm leading-6 text-muted-foreground">
        That screen is not part of The Bubble.
      </p>
      <Button asChild className="w-fit">
        <Link href="/">Back home</Link>
      </Button>
    </main>
  );
}
