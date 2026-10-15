import type { Metadata } from "next";

import { InterestsSetupScreen } from "@/features/prototype/setup-screens";

export const metadata: Metadata = { title: "Interests" };

export default function InterestsSetupPage() {
  return <InterestsSetupScreen />;
}
