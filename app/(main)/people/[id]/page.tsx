import type { Metadata } from "next";

import { prototypePeople } from "@/features/prototype/data";
import { PersonScreen } from "@/features/prototype/screens";

export const metadata: Metadata = { title: "Profile" };
export const dynamicParams = false;

export function generateStaticParams() {
  return prototypePeople.map((person) => ({ id: person.id }));
}

export default async function PersonProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PersonScreen id={id} />;
}
