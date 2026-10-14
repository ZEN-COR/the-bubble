import type { Metadata } from "next";

import { VerifyScreen } from "@/features/prototype/screens";

export const metadata: Metadata = { title: "Verify email" };

export default function VerifyPage() {
  return <VerifyScreen />;
}
