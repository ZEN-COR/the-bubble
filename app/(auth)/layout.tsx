import Link from "next/link";

import { Wordmark } from "@/components/brand/wordmark";
import { PrototypeBanner } from "@/features/prototype/banner";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <PrototypeBanner />
      <header className="mx-auto flex w-full max-w-lg px-4 py-4">
        <Link href="/" className="inline-flex min-h-11 items-center">
          <Wordmark />
        </Link>
      </header>
      <div className="mx-auto flex w-full max-w-lg flex-1 px-4 py-6">{children}</div>
    </div>
  );
}
