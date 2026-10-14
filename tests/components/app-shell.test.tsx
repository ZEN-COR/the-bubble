import type { AnchorHTMLAttributes } from "react";
import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";

import { AppShell } from "@/components/shell/app-shell";
import { PrototypeProvider } from "@/features/prototype/store";

vi.mock("next/navigation", () => ({
  usePathname: () => "/events/example",
}));

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

test("primary navigation exposes labelled destinations and the current section", () => {
  render(
    <PrototypeProvider>
      <AppShell>
        <main id="main">Events</main>
      </AppShell>
    </PrototypeProvider>,
  );

  const eventsLinks = screen.getAllByRole("link", { name: "Events" });
  expect(eventsLinks.length).toBeGreaterThan(0);
  expect(eventsLinks.every((link) => link.getAttribute("aria-current") === "page")).toBe(
    true,
  );

  for (const label of ["People", "Groups", "Messages", "Calendar", "Profile"]) {
    expect(screen.getAllByRole("link", { name: label }).length).toBeGreaterThan(0);
  }
});
