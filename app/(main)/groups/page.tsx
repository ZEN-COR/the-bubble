import type { Metadata } from "next";

import { GroupsScreen } from "@/features/prototype/screens";

export const metadata: Metadata = { title: "Groups" };

export default function GroupsPage() {
  return <GroupsScreen />;
}
