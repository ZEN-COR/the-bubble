import type { Metadata } from "next";

import { StartGroupTopicScreen } from "@/features/prototype/start-group-screens";

export const metadata: Metadata = { title: "Start a group" };

export default function StartGroupPage() {
  return <StartGroupTopicScreen />;
}
