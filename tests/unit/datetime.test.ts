import { expect, test } from "vitest";

import { formatAucklandDateTime } from "@/lib/datetime";

test("formats an instant in Pacific/Auckland during daylight saving", () => {
  const formatted = formatAucklandDateTime(new Date("2026-11-03T04:30:00.000Z"));

  expect(formatted).toContain("3");
  expect(formatted).toContain("Nov");
  expect(formatted).toContain("2026");
  expect(formatted.toLowerCase()).toContain("5:30");
  expect(formatted).toMatch(/NZDT|GMT\+13/);
});
