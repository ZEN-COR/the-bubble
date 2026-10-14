import type { Metadata } from "next";

import { OnboardingScreen } from "@/features/prototype/screens";

export const metadata: Metadata = { title: "Onboarding" };

export default function OnboardingPage() {
  return <OnboardingScreen />;
}
