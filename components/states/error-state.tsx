import { Button } from "@/components/ui/button";

export function ErrorState({
  title = "This could not be loaded",
  description = "Check your connection and try again.",
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div role="alert" className="rounded-xl border bg-card px-4 py-8 text-center">
      <h2 className="text-base font-medium">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        {description}
      </p>
      {onRetry ? (
        <Button type="button" className="mt-4" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </div>
  );
}
