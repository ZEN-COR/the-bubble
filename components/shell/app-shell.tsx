"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Wordmark } from "@/components/brand/wordmark";
import { PrototypeBanner } from "@/features/prototype/banner";
import { isNavItemActive, mainNavigation, profileNavigation } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-dvh bg-background">
      <div className="md:grid md:grid-cols-[16rem_minmax(0,1fr)]">
        <aside className="sticky top-0 hidden h-dvh flex-col bg-sidebar md:flex">
          <div className="px-4 py-5">
            <Link href="/people" className="inline-flex min-h-11 items-center rounded-lg">
              <Wordmark />
            </Link>
          </div>
          <nav aria-label="Primary" className="flex flex-1 flex-col gap-1 px-3">
            {mainNavigation.map((item) => (
              <ShellLink key={item.href} href={item.href} pathname={pathname} layout="row">
                <item.icon aria-hidden="true" />
                {item.label}
              </ShellLink>
            ))}
          </nav>
          <div className="border-t p-3">
            <ShellLink href={profileNavigation.href} pathname={pathname} layout="row">
              <profileNavigation.icon aria-hidden="true" />
              {profileNavigation.label}
            </ShellLink>
          </div>
        </aside>

        <div className="pb-24 md:pb-0">
          <PrototypeBanner />
          <header className="sticky top-0 z-20 flex items-center justify-between bg-background/95 px-4 py-2 md:hidden">
            <Link href="/people" className="inline-flex min-h-11 items-center">
              <Wordmark />
            </Link>
            <Link
              href={profileNavigation.href}
              aria-label={profileNavigation.label}
              aria-current={
                isNavItemActive(pathname, profileNavigation.href) ? "page" : undefined
              }
              className="inline-flex size-11 items-center justify-center rounded-full bg-secondary text-foreground"
            >
              <profileNavigation.icon aria-hidden="true" />
            </Link>
          </header>
          {children}
        </div>
      </div>

      <nav
        aria-label="Primary"
        className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-card md:hidden"
      >
        <ul className="grid grid-cols-6">
          {mainNavigation.map((item) => (
            <li key={item.href}>
              <ShellLink href={item.href} pathname={pathname} layout="tab">
                <item.icon aria-hidden="true" />
                {item.label}
              </ShellLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

function ShellLink({
  href,
  pathname,
  layout,
  children,
}: {
  href: string;
  pathname: string;
  layout: "row" | "tab";
  children: ReactNode;
}) {
  const active = isNavItemActive(pathname, href);

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "focus-visible:ring-2 focus-visible:ring-ring",
        layout === "row" &&
          "flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium",
        layout === "tab" &&
          "flex min-h-11 w-full flex-col items-center justify-center gap-1 px-1 py-2 text-[10px] font-medium",
        active
          ? "text-foreground"
          : "text-[#9a9a9a] hover:text-foreground",
        layout === "row" && active && "bg-accent text-accent-foreground",
      )}
    >
      {children}
    </Link>
  );
}
