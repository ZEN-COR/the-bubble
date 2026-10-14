import type { Metadata } from "next";

import { prototypeGroups } from "@/features/prototype/data";
import { GroupScreen } from "@/features/prototype/screens";

export const metadata: Metadata = { title: "Group" };
export const dynamicParams = false;

export function generateStaticParams() {
  return prototypeGroups.map((group) => ({ id: group.id }));
}

export default async function GroupDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <GroupScreen id={id} />;
}
