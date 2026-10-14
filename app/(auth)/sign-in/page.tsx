import type { Metadata } from "next";

import { SignInScreen } from "@/features/prototype/screens";

export const metadata: Metadata = { title: "Sign in" };

export default function SignInPage() {
  return <SignInScreen />;
}
