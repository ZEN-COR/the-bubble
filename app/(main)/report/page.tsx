import type { Metadata } from "next";

import { ReportScreen } from "@/features/prototype/screens";

export const metadata: Metadata = { title: "Report" };

export default function ReportPage() {
  return <ReportScreen />;
}
