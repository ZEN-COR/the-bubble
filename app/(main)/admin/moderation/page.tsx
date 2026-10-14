import type { Metadata } from "next";

import { ModerationScreen } from "@/features/prototype/screens";

export const metadata: Metadata = { title: "Moderation" };

export default function ModerationPage() {
  return <ModerationScreen />;
}
