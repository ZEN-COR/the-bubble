import { expect, test } from "vitest";

import { displayNameSchema } from "@/lib/validation/profile";

test("display names use the same 1 to 40 character limit as the database", () => {
  expect(displayNameSchema.safeParse("  Avery Chen  ").success).toBe(true);
  expect(displayNameSchema.safeParse("   ").success).toBe(false);
  expect(displayNameSchema.safeParse("A".repeat(41)).success).toBe(false);
});
