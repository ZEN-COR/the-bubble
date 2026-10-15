import type { Metadata } from "next";

import { CampusSetupScreen } from "@/features/prototype/setup-screens";

export const metadata: Metadata = { title: "Campus days" };

export default function CampusSetupPage() {
  return <CampusSetupScreen />;
}
