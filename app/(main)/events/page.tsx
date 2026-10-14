import type { Metadata } from "next";

import { EventsScreen } from "@/features/prototype/screens";

export const metadata: Metadata = { title: "Events" };

export default function EventsPage() {
  return <EventsScreen />;
}
