import type { Metadata } from "next";

import { PrototypeProvider } from "@/features/prototype/store";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "The Bubble",
    template: "%s · The Bubble",
  },
  description:
    "A calm way for verified university students to find classmates and plan to meet. Not a dating app and not a university service.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full bg-background text-foreground">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-background focus:px-3 focus:py-2"
        >
          Skip to content
        </a>
        <PrototypeProvider>{children}</PrototypeProvider>
      </body>
    </html>
  );
}
