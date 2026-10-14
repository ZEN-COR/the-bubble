export function UnavailablePanel({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <main id="main" className="mx-auto flex w-full max-w-3xl flex-col gap-3 px-4 py-8">
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      <p className="max-w-2xl text-base leading-7 text-muted-foreground">{description}</p>
    </main>
  );
}
