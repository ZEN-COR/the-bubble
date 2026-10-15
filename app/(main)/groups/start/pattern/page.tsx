import type { Metadata } from "next";

import { StartGroupPatternScreen } from "@/features/prototype/start-group-screens";

export const metadata: Metadata = { title: "Meeting pattern" };

export default function GroupPatternPage() {
  return <StartGroupPatternScreen />;
}
