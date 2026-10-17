import Link from "next/link";

import { PlaceholderArt, type Scene } from "@/components/brand/placeholder-art";
import { Wordmark } from "@/components/brand/wordmark";
import { Button } from "@/components/ui/button";

const steps: { title: string; body: string; scene: Scene }[] = [
  {
    title: "Discover",
    body: "See classmates who share a course, an interest, or a campus day.",
    scene: "discover",
  },
  {
    title: "Connect",
    body: "Send a short introduction. Chat opens after you both agree.",
    scene: "connect",
  },
  {
    title: "Meet",
    body: "Plan a public campus meetup that fits the week you already have.",
    scene: "meet",
  },
];

export default function HomePage() {
  return (
    <div className="flex min-h-full flex-col bg-background">
      <header className="mx-auto flex w-full max-w-lg items-center justify-between px-4 py-4">
        <Wordmark />
        <Link href="/sign-in" className="inline-flex min-h-11 items-center text-sm font-semibold">
          Sign in
        </Link>
      </header>
      <section className="relative overflow-hidden bg-gradient-to-b from-[#187a4c] to-[#125c3a] px-4 pb-20 pt-8 text-white">
        <div className="mx-auto max-w-lg">
          <p className="text-sm font-medium">University students only</p>
          <h1 className="mt-3 max-w-[16ch] text-[2rem] leading-[2.4rem] font-semibold tracking-tight">
            Find your people on campus.
          </h1>
          <p className="mt-3 max-w-[36ch] text-sm leading-5">
            The Bubble helps students notice shared courses, interests, and campus
            days. It is not a dating app or an official university service.
          </p>
        </div>
        <div className="absolute inset-x-0 -bottom-px h-10 rounded-t-[28px] bg-background" />
      </section>
      <main id="main" className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-6 px-4 pb-10">
        <Button asChild className="w-full">
          <Link href="/sign-in">Open the prototype</Link>
        </Button>
        <section aria-label="How it works" className="grid gap-3">
          <p className="text-sm text-muted-foreground">How it works — these are illustrations, not interactive cards. Use “Open the prototype” to begin.</p>
          {steps.map((step) => (
            <article key={step.title} className="overflow-hidden rounded-[20px] bg-card shadow-[var(--shadow-card)] [--card-spacing:--spacing(4)]">
              <div className="mx-auto max-w-[230px]"><PlaceholderArt bleed={false} scene={step.scene} /></div>
              <div className="px-4 pb-4">
              <h2 className="text-base font-semibold">{step.title}</h2>
              <p className="mt-1 text-sm leading-5 text-muted-foreground">{step.body}</p>
              </div>
            </article>
          ))}
        </section>
        <section aria-labelledby="privacy-heading">
          <h2 id="privacy-heading" className="text-base font-semibold">
            Privacy and participation
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-5 text-muted-foreground">
            <li>The prototype does not display your university email publicly. It is not a production authentication system.</li>
            <li>Discovery is off until you turn it on.</li>
            <li>Campus days stay hidden. Overlap can be mentioned only with consent.</li>
            <li>A verified email is not proof of identity or course enrolment.</li>
          </ul>
        </section>
      </main>
      <footer className="mx-auto w-full max-w-lg px-4 py-8 text-sm text-muted-foreground">
        The Bubble is an independent student project. It does not use university branding and
        is not endorsed by a university.
      </footer>
    </div>
  );
}
