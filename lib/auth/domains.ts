const DOMAIN_PATTERN =
  /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/;

export function parseAllowedEmailDomains(raw: string | undefined): string[] {
  if (!raw?.trim()) {
    return [];
  }

  const domains = raw
    .split(",")
    .map((part) => part.trim().toLowerCase())
    .filter((part) => part.length > 0);

  for (const domain of domains) {
    if (!DOMAIN_PATTERN.test(domain)) {
      throw new Error(`Invalid email domain in allowlist: ${domain}`);
    }
  }

  return [...new Set(domains)];
}

export function isAllowedUniversityEmail(
  email: string,
  domains: readonly string[],
): boolean {
  const trimmed = email.trim().toLowerCase();
  const at = trimmed.indexOf("@");

  if (at <= 0 || at !== trimmed.lastIndexOf("@")) {
    return false;
  }

  const domain = trimmed.slice(at + 1);
  if (!DOMAIN_PATTERN.test(domain)) {
    return false;
  }

  return domains.includes(domain);
}
