import type { Metadata } from "next";

import { CoursesSetupScreen } from "@/features/prototype/setup-screens";

export const metadata: Metadata = { title: "Courses" };

export default function CoursesSetupPage() {
  return <CoursesSetupScreen />;
}
