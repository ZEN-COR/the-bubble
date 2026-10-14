import type { Metadata } from "next";

import { MessagesScreen } from "@/features/prototype/screens";

export const metadata: Metadata = { title: "Chats" };

export default function MessagesPage() {
  return <MessagesScreen />;
}
