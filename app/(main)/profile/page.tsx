import type { Metadata } from "next";

import { ProfileScreen } from "@/features/prototype/screens";

export const metadata: Metadata = { title: "Your profile" };

export default function ProfilePage() {
  return <ProfileScreen />;
}
