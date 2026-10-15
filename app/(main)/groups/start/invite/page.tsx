import type { Metadata } from "next";

import { StartGroupInviteScreen } from "@/features/prototype/start-group-screens";

export const metadata: Metadata = { title: "Invite students" };

export default function GroupInvitePage() {
  return <StartGroupInviteScreen />;
}
