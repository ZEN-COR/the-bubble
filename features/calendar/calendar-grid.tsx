"use client";

import { useState } from "react";
import Link from "next/link";
import { prototypeEvents, personById } from "@/features/prototype/data";
import { usePrototype } from "@/features/prototype/store";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
function nzDate(iso: string) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Pacific/Auckland", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(iso));
}
function monthKey(date: Date) { return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}`; }

export function CalendarGrid() {
  const { state } = usePrototype();
  const [month, setMonth] = useState(() => new Date());
  const [selected, setSelected] = useState<number | null>(null);
  const year = month.getFullYear();
  const index = month.getMonth();
  const count = new Date(year, index + 1, 0).getDate();
  const offset = (new Date(year, index, 1).getDay() + 6) % 7;
  const eventDate = (day: number) => `${monthKey(month)}-${String(day).padStart(2,"0")}`;
  const events = prototypeEvents.filter(event => state.rsvps[event.id] === "going");
  const eventOnDay = (day: number) => events.filter(event => nzDate(event.startsAt) === eventDate(day));
  const meetups = state.meetups.filter(m => m.status === "confirmed");
  const shift = (amount: number) => { setMonth(new Date(year, index + amount, 1)); setSelected(null); };
  return <main id="main" className="mx-auto flex w-full max-w-2xl flex-col gap-5 px-4 py-6">
    <div><h1 className="text-2xl font-semibold">Your calendar</h1><p className="mt-1 text-sm text-muted-foreground">Select a date to see events you are attending. Times are in Pacific/Auckland.</p></div>
    <section aria-label="Monthly calendar" className="rounded-2xl bg-card p-3 shadow-[var(--shadow-card)]">
      <div className="mb-4 flex items-center justify-between gap-3"><button type="button" aria-label="Previous month" onClick={() => shift(-1)} className="min-h-11 rounded-lg px-3 hover:bg-secondary">←</button><h2 className="text-lg font-semibold">{month.toLocaleDateString("en-NZ", {month:"long", year:"numeric"})}</h2><button type="button" aria-label="Next month" onClick={() => shift(1)} className="min-h-11 rounded-lg px-3 hover:bg-secondary">→</button></div>
      <div className="grid grid-cols-7 gap-1 text-center">{days.map(day => <span key={day} className="py-2 text-xs font-semibold text-muted-foreground">{day}</span>)}{Array.from({length:offset}, (_,i)=><span key={`blank-${i}`} />)}{Array.from({length:count},(_,i)=>i+1).map(day => { const hasEvents = eventOnDay(day).length>0; return <button key={day} type="button" onClick={()=>setSelected(day)} aria-pressed={selected===day} aria-label={`${day} ${month.toLocaleDateString("en-NZ",{month:"long",year:"numeric"})}${hasEvents ? ", event scheduled" : ""}`} className={`relative min-h-12 rounded-lg text-sm focus-visible:ring-2 focus-visible:ring-ring ${selected===day ? "bg-[#176b4b] text-white" : "hover:bg-secondary"}`}>{day}{hasEvents && <span aria-hidden="true" className={`mx-auto mt-1 block size-1.5 rounded-full ${selected===day ? "bg-white" : "bg-[#176b4b]"}`} />}</button>;})}</div>
    </section>
    {selected !== null && <section aria-live="polite" className="rounded-xl bg-secondary p-4"><h3 className="font-semibold">{selected} {month.toLocaleDateString("en-NZ",{month:"long",year:"numeric"})}</h3>{eventOnDay(selected).length ? eventOnDay(selected).map(event=><Link key={event.id} href={`/events/${event.id}`} className="mt-2 block rounded-lg bg-card p-3 font-medium underline">{event.title} — {event.startsAtLabel}</Link>) : <p className="mt-2 text-sm text-muted-foreground">No RSVP events on this date.</p>}</section>}
    <section className="space-y-2"><h2 className="text-lg font-semibold">Events you are attending</h2>{events.length ? events.map(event=><Link key={event.id} href={`/events/${event.id}`} className="block rounded-xl bg-card p-4 shadow-[var(--shadow-card)]"><span className="font-semibold">{event.title}</span><p className="text-sm text-muted-foreground">{event.startsAtLabel} · {event.locationLabel}</p></Link>) : <p className="text-sm text-muted-foreground">No RSVPs yet. <Link href="/events" className="underline">Discover events</Link>.</p>}</section>
    <section className="space-y-2"><h2 className="text-lg font-semibold">Confirmed meetups</h2>{meetups.length ? meetups.map(m=><Link key={m.id} href={`/messages/${m.personId}`} className="block rounded-xl bg-card p-4 shadow-[var(--shadow-card)]"><span className="font-semibold">{personById(m.personId)?.displayName ?? "Student"}</span><p className="text-sm">{m.day}, {m.time} · {m.place}</p></Link>) : <p className="text-sm text-muted-foreground">Confirmed meetups will appear here. Meetup proposals currently use weekday labels, not exact dates, so they cannot be placed accurately in the month grid.</p>}</section>
  </main>;
}
