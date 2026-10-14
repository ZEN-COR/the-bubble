import type { Metadata } from "next";

import { ConnectionsScreen } from "@/features/prototype/screens";

export const metadata: Metadata = { title: "Connections" };

export default function ConnectionsPage() {
  return <ConnectionsScreen />;
}
