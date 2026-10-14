import { cn } from "@/lib/utils";

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 font-semibold tracking-tight", className)}>
      <svg aria-hidden="true" viewBox="0 0 32 32" className="size-8 text-brand">
        <circle cx="16" cy="16" r="12" fill="currentColor" opacity="0.18" />
        <circle cx="16" cy="16" r="6" fill="currentColor" />
      </svg>
      The Bubble
    </span>
  );
}
