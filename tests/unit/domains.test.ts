import { describe, expect, test } from "vitest";

import {
  isAllowedUniversityEmail,
  parseAllowedEmailDomains,
} from "@/lib/auth/domains";

describe("university email allowlist", () => {
  test("an empty allowlist rejects every address", () => {
    expect(parseAllowedEmailDomains(undefined)).toEqual([]);
    expect(parseAllowedEmailDomains("  ")).toEqual([]);
    expect(isAllowedUniversityEmail("student@example.test", [])).toBe(false);
  });

  test("parses a comma-separated list without treating a subdomain as a match", () => {
    const domains = parseAllowedEmailDomains(" Example.Test, mail.example.test ");

    expect(domains).toEqual(["example.test", "mail.example.test"]);
    expect(isAllowedUniversityEmail("Student@Example.Test", domains)).toBe(true);
    expect(isAllowedUniversityEmail("student@mail.example.test", domains)).toBe(true);
    expect(isAllowedUniversityEmail("student@notexample.test", domains)).toBe(false);
    expect(isAllowedUniversityEmail("student@example.test.evil.com", domains)).toBe(false);
    expect(isAllowedUniversityEmail("student@evil.example.test", domains)).toBe(false);
  });

  test("rejects malformed addresses", () => {
    const domains = ["example.test"];

    expect(isAllowedUniversityEmail("example.test", domains)).toBe(false);
    expect(isAllowedUniversityEmail("@example.test", domains)).toBe(false);
    expect(isAllowedUniversityEmail("a@b@example.test", domains)).toBe(false);
  });

  test("rejects an invalid domain in the operator allowlist", () => {
    expect(() => parseAllowedEmailDomains("not a domain")).toThrow(/Invalid email domain/);
  });
});
