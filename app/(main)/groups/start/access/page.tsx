import type { Metadata } from "next";

import { StartGroupAccessScreen } from "@/features/prototype/start-group-screens";

export const metadata: Metadata = { title: "Who can join" };

export default function GroupAccessPage() {
  return <StartGroupAccessScreen />;
}
