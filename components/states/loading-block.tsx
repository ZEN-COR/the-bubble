import { Skeleton } from "@/components/ui/skeleton";

export function LoadingBlock() {
  return (
    <main id="main" aria-busy="true" aria-live="polite" className="mx-auto w-full max-w-3xl px-4 py-8">
      <span className="sr-only">Loading</span>
      <div className="flex flex-col gap-3">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    </main>
  );
}
