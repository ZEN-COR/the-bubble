import { readFileSync } from "node:fs";
import path from "node:path";

import { afterEach, expect, test, vi } from "vitest";

import { getSupabasePublicEnv } from "@/lib/supabase/env";

const root = path.resolve(import.meta.dirname, "../..");

afterEach(() => {
  vi.unstubAllEnvs();
});

test("public Supabase config is absent until both values are set", () => {
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "");
  expect(getSupabasePublicEnv()).toBeNull();

  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "http://127.0.0.1:54321");
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "anon-key");
  expect(getSupabasePublicEnv()).toEqual({
    url: "http://127.0.0.1:54321",
    anonKey: "anon-key",
  });
});

test("the service role stays in a server-only module", () => {
  const server = readFileSync(path.join(root, "lib/supabase/server.ts"), "utf8");
  const browser = readFileSync(path.join(root, "lib/supabase/browser.ts"), "utf8");
  const admin = readFileSync(path.join(root, "lib/supabase/admin.ts"), "utf8");

  expect(server).toContain('import "server-only"');
  expect(server).not.toContain("SERVICE_ROLE");
  expect(browser).not.toContain("SERVICE_ROLE");
  expect(browser).not.toContain("server-only");
  expect(admin).toContain('import "server-only"');
  expect(admin).toContain("SUPABASE_SERVICE_ROLE_KEY");
});

test("migrations do not hardcode a university domain", () => {
  const schema = readFileSync(
    path.join(root, "supabase/migrations/0001_schema.sql"),
    "utf8",
  );
  const policies = readFileSync(
    path.join(root, "supabase/migrations/0002_rls.sql"),
    "utf8",
  );
  const seed = readFileSync(path.join(root, "supabase/seed.sql"), "utf8");

  expect(schema).toContain("char_length(btrim(display_name)) between 1 and 40");
  expect(schema).toContain("char_length(bio) <= 280");
  expect(schema).toContain("enable row level security");
  expect(`${schema}\n${policies}\n${seed}`.toLowerCase()).not.toContain("myvuw");
  expect(`${schema}\n${policies}\n${seed}`.toLowerCase()).not.toContain("vuw.ac.nz");
  expect(seed).toContain("Avery Chen");
  expect(seed).toContain("example.test");
});
