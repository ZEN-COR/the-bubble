import type { Metadata } from "next";

import { NotificationsScreen } from "@/features/prototype/screens";

export const metadata: Metadata = { title: "Notifications" };

export default function NotificationSettingsPage() {
  return <NotificationsScreen />;
}
