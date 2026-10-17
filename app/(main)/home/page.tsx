import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, UsersRound, Users, UserRoundCheck, MessagesSquare, Calendar } from "lucide-react";

export const metadata: Metadata = { title: "Home" };
const destinations = [
  { href: "/groups", title: "Find your community", description: "Start with a study group or a shared interest.", icon: UsersRound },
  { href: "/events", title: "Discover activities", description: "Meet students at a campus event.", icon: CalendarDays },
  { href: "/people", title: "Explore people", description: "Find classmates with common ground.", icon: Users },
  { href: "/connections", title: "Connections", description: "Review requests and meet-up plans.", icon: UserRoundCheck },
  { href: "/messages", title: "Messages", description: "Continue conversations with connections.", icon: MessagesSquare },
  { href: "/calendar", title: "Your calendar", description: "See events and confirmed meetups.", icon: Calendar },
];
export default function HomePage() {
  return <main id="main" className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-7">
    <section className="rounded-3xl bg-[#176b4b] p-6 text-white"><p className="text-sm font-semibold">Welcome to The Bubble</p><h1 className="mt-2 text-3xl font-semibold">Find your people, naturally.</h1><p className="mt-3 text-sm leading-6">Start with a group or an activity, discover common ground, and build connections that carry into campus life.</p><Link href="/groups" className="mt-5 inline-flex min-h-11 items-center rounded-xl bg-white px-4 text-sm font-semibold text-[#176b4b]">Explore groups →</Link></section>
    <section aria-labelledby="explore-heading"><h2 id="explore-heading" className="mb-3 text-xl font-semibold">Explore The Bubble</h2><div className="grid gap-3 sm:grid-cols-2">{destinations.map(({href,title,description,icon:Icon}) => <Link key={href} href={href} className="flex min-h-32 flex-col gap-2 rounded-2xl bg-card p-4 shadow-[var(--shadow-card)] focus-visible:ring-2 focus-visible:ring-ring"><Icon className="size-6 text-[#176b4b]" aria-hidden="true"/><h3 className="font-semibold">{title}</h3><p className="text-sm text-muted-foreground">{description}</p></Link>)}</div></section>
    <p className="text-xs text-muted-foreground">This is a demonstration prototype. Groups, events, and messages use sample data.</p>
  </main>;
}
