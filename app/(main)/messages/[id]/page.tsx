import type { Metadata } from "next";

import { prototypePeople } from "@/features/prototype/data";
import { ChatScreen } from "@/features/prototype/screens";

export const metadata: Metadata = { title: "Chat" };
export const dynamicParams = false;

export function generateStaticParams() {
  return prototypePeople.map((person) => ({ id: person.id }));
}

export default async function MessageThreadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ChatScreen id={id} />;
}
