import type { Metadata } from "next";

import { PrivacyScreen } from "@/features/prototype/screens";

export const metadata: Metadata = { title: "Privacy" };

export default function PrivacySettingsPage() {
  return <PrivacyScreen />;
}
