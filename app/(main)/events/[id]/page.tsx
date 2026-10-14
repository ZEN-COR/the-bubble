import type { Metadata } from "next";

import { prototypeEvents } from "@/features/prototype/data";
import { EventScreen } from "@/features/prototype/screens";

export const metadata: Metadata = { title: "Event" };
export const dynamicParams = false;

export function generateStaticParams() {
  return prototypeEvents.map((event) => ({ id: event.id }));
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EventScreen id={id} />;
}
