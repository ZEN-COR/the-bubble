// @vitest-environment node

import { readFileSync } from "node:fs";
import path from "node:path";

import { PGlite } from "@electric-sql/pglite";
import { afterAll, beforeAll, beforeEach, expect, test } from "vitest";

const root = path.resolve(import.meta.dirname, "../..");

const AVERY = "11111111-1111-4111-8111-111111111111";
const JORDAN = "22222222-2222-4222-8222-222222222222";
const SAM = "33333333-3333-4333-8333-333333333333";
const RILEY = "44444444-4444-4444-8444-444444444444";
const QUINN = "55555555-5555-4555-8555-555555555555";
const CASEY = "66666666-6666-4666-8666-666666666666";
const NORA = "99999999-9999-4999-8999-999999999999";
const OUTSIDER = "12121212-1212-4121-8121-121212121212";
const PUBLIC_EVENT = "dddddddd-dddd-4ddd-8ddd-ddddddddddd1";
const PRIVATE_EVENT = "dddddddd-dddd-4ddd-8ddd-ddddddddddd2";
const DRAFT_EVENT = "dddddddd-dddd-4ddd-8ddd-ddddddddddd3";
const PRIVATE_GROUP = "cccccccc-cccc-4ccc-8ccc-ccccccccccc2";
const CONVERSATION = "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee";

let db: PGlite;

function sqlString(value: string) {
  return `'${value.replaceAll("'", "''")}'`;
}

async function resetSession() {
  try {
    await db.exec("reset role");
  } catch {
    await db.exec("rollback");
    await db.exec("reset role");
  }
  await db.exec("select set_config('request.jwt.claim.sub', '', false)");
}

async function asUser<T>(userId: string, run: () => Promise<T>) {
  await resetSession();
  await db.exec(`select set_config('request.jwt.claim.sub', ${sqlString(userId)}, false)`);
  await db.exec("set role authenticated");
  try {
    return await run();
  } finally {
    await resetSession();
  }
}

async function count(statement: string) {
  const result = await db.query<{ count: number }>(statement);
  return Number(result.rows[0]?.count ?? 0);
}

beforeAll(async () => {
  db = new PGlite();
  await db.exec(`
    create schema if not exists auth;
    create table auth.users (
      id uuid primary key,
      email text,
      email_confirmed_at timestamptz
    );
    create or replace function auth.uid() returns uuid
    language sql stable as $$
      select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid;
    $$;
  `);

  for (const file of ["0001_schema.sql", "0002_rls.sql"]) {
    await db.exec(readFileSync(path.join(root, "supabase/migrations", file), "utf8"));
  }
  await db.exec(readFileSync(path.join(root, "supabase/seed.sql"), "utf8"));

  const users = [
    [AVERY, "avery.chen@example.test", "now()"],
    [JORDAN, "jordan.blake@example.test", "now()"],
    [SAM, "sam.patel@example.test", "now()"],
    [RILEY, "riley.nguyen@example.test", "now()"],
    [QUINN, "quinn.okonkwo@example.test", "now()"],
    [CASEY, "casey.morgan@example.test", "now()"],
    [NORA, "nora.unconfirmed@example.test", "null"],
    [OUTSIDER, "pat@example.invalid", "now()"],
  ] as const;

  for (const [id, email, confirmed] of users) {
    await db.exec(
      `insert into auth.users (id, email, email_confirmed_at) values (${sqlString(id)}::uuid, ${sqlString(email)}, ${confirmed})`,
    );
  }

  await db.exec(`
    update public.profiles set
      display_name = 'Avery Chen',
      discoverable = true,
      campus_day_visibility = true,
      life_stage = 'Hidden stage',
      life_stage_opt_in = false,
      onboarding_completed = true
    where id = '${AVERY}';

    update public.profiles set
      display_name = 'Jordan Blake',
      discoverable = true,
      campus_day_visibility = true,
      onboarding_completed = true
    where id = '${JORDAN}';

    update public.profiles set
      display_name = 'Sam Patel',
      discoverable = false,
      onboarding_completed = true
    where id = '${SAM}';

    update public.profiles set
      display_name = 'Riley Nguyen',
      discoverable = true,
      status = 'suspended',
      onboarding_completed = true
    where id = '${RILEY}';

    update public.profiles set
      display_name = 'Quinn Okonkwo',
      app_role = 'moderator',
      discoverable = false,
      onboarding_completed = true
    where id = '${QUINN}';

    update public.profiles set
      display_name = 'Casey Morgan',
      discoverable = true,
      life_stage = 'Returning student',
      life_stage_opt_in = true,
      onboarding_completed = true
    where id = '${CASEY}';

    insert into public.campus_days (profile_id, weekday) values
      ('${AVERY}', 1),
      ('${JORDAN}', 1);

    insert into public.groups (id, name, slug, description, category, privacy, owner_id)
    values
      ('cccccccc-cccc-4ccc-8ccc-ccccccccccc1', 'COMP261 study circle', 'comp261-study-circle', 'Public fixture', 'course_study', 'public', '${AVERY}'),
      ('${PRIVATE_GROUP}', 'Evening commuters', 'evening-commuters', 'Private fixture', 'interest', 'private', '${CASEY}');

    insert into public.group_members (group_id, profile_id, role, status) values
      ('cccccccc-cccc-4ccc-8ccc-ccccccccccc1', '${AVERY}', 'owner', 'active'),
      ('${PRIVATE_GROUP}', '${CASEY}', 'owner', 'active');

    insert into public.events (
      id, creator_id, group_id, title, description, starts_at, ends_at, timezone, location_label, published
    ) values
      ('${PUBLIC_EVENT}', '${AVERY}', null, 'Algorithms catch-up', 'Public fixture', '2026-11-03 17:30:00+13', '2026-11-03 19:00:00+13', 'Pacific/Auckland', 'Library foyer', true),
      ('${PRIVATE_EVENT}', '${CASEY}', '${PRIVATE_GROUP}', 'Weekend planning chat', 'Private fixture', '2026-11-07 10:00:00+13', '2026-11-07 11:30:00+13', 'Pacific/Auckland', 'Quad benches', true),
      ('${DRAFT_EVENT}', '${AVERY}', null, 'Draft afternoon', 'Hidden draft', '2026-11-14 14:00:00+13', '2026-11-14 16:00:00+13', 'Pacific/Auckland', 'Lounge', false);

    insert into public.event_rsvps (event_id, profile_id, status, visible_to_attendees) values
      ('${PUBLIC_EVENT}', '${AVERY}', 'going', true),
      ('${PUBLIC_EVENT}', '${JORDAN}', 'going', false);

    insert into public.connections (user_low_id, user_high_id)
    select least(a, b), greatest(a, b)
    from (values ('${AVERY}'::uuid, '${SAM}'::uuid), ('${AVERY}'::uuid, '${JORDAN}'::uuid)) as pairs(a, b);

    insert into public.conversations (id, user_low_id, user_high_id)
    select '${CONVERSATION}', least('${AVERY}'::uuid, '${JORDAN}'::uuid), greatest('${AVERY}'::uuid, '${JORDAN}'::uuid);

    insert into public.messages (conversation_id, sender_id, body)
    values ('${CONVERSATION}', '${AVERY}', 'Hello from the fixture');
  `);
}, 60000);

beforeEach(async () => {
  await resetSession();
});

afterAll(async () => {
  await db.close();
});

test("anonymous and unverified accounts cannot read profiles", async () => {
  await expect(db.exec("set role anon; select id from public.profiles")).rejects.toThrow();
  await resetSession();

  expect(await asUser(NORA, () => count("select count(*)::int as count from public.profiles"))).toBe(
    0,
  );
  expect(
    await asUser(OUTSIDER, () => count("select count(*)::int as count from public.profiles")),
  ).toBe(0);
});

test("a verified student can read their own profile but not privileged columns", async () => {
  expect(
    await asUser(AVERY, () =>
      count(`select count(*)::int as count from public.profiles where id = '${AVERY}'`),
    ),
  ).toBe(1);

  await expect(
    asUser(AVERY, () => db.query("select life_stage from public.profiles")),
  ).rejects.toThrow(/permission denied/i);

  await expect(
    asUser(AVERY, () =>
      db.query(
        `update public.profiles set status = 'suspended' where id = '${AVERY}'`,
      ),
    ),
  ).rejects.toThrow(/permission denied/i);
});

test("life stage is visible only to the owner or when explicitly opted in", async () => {
  const own = await asUser(AVERY, () =>
    db.query<{ visible_life_stage: string | null }>(
      `select public.visible_life_stage('${AVERY}')`,
    ),
  );
  const hidden = await asUser(JORDAN, () =>
    db.query<{ visible_life_stage: string | null }>(
      `select public.visible_life_stage('${AVERY}')`,
    ),
  );
  const shared = await asUser(AVERY, () =>
    db.query<{ visible_life_stage: string | null }>(
      `select public.visible_life_stage('${CASEY}')`,
    ),
  );

  expect(own.rows[0]?.visible_life_stage).toBe("Hidden stage");
  expect(hidden.rows[0]?.visible_life_stage).toBeNull();
  expect(shared.rows[0]?.visible_life_stage).toBe("Returning student");
});

test("discovery hides opted-out, suspended, and blocked profiles", async () => {
  expect(
    await asUser(AVERY, () =>
      count(`select count(*)::int as count from public.profiles where id = '${SAM}'`),
    ),
  ).toBe(1);
  expect(
    await asUser(JORDAN, () =>
      count(`select count(*)::int as count from public.profiles where id = '${SAM}'`),
    ),
  ).toBe(0);
  expect(
    await asUser(JORDAN, () =>
      count(`select count(*)::int as count from public.profiles where id = '${RILEY}'`),
    ),
  ).toBe(0);

  await asUser(AVERY, () =>
    db.query(
      `insert into public.blocks (blocker_id, blocked_id) values ('${AVERY}', '${CASEY}')`,
    ),
  );
  expect(
    await asUser(CASEY, () =>
      count(`select count(*)::int as count from public.profiles where id = '${AVERY}'`),
    ),
  ).toBe(0);
  await db.exec(
    `delete from public.blocks where blocker_id = '${AVERY}' and blocked_id = '${CASEY}'`,
  );
});

test("campus days are not readable and overlap is only a boolean for the people involved", async () => {
  expect(
    await asUser(JORDAN, () =>
      count(`select count(*)::int as count from public.campus_days where profile_id = '${AVERY}'`),
    ),
  ).toBe(0);

  const overlap = await asUser(AVERY, () =>
    db.query<{ profiles_share_opted_in_campus_day: boolean }>(
      `select public.profiles_share_opted_in_campus_day('${AVERY}', '${JORDAN}')`,
    ),
  );
  const stranger = await asUser(CASEY, () =>
    db.query<{ profiles_share_opted_in_campus_day: boolean }>(
      `select public.profiles_share_opted_in_campus_day('${AVERY}', '${JORDAN}')`,
    ),
  );

  expect(overlap.rows[0]?.profiles_share_opted_in_campus_day).toBe(true);
  expect(stranger.rows[0]?.profiles_share_opted_in_campus_day).toBe(false);
});

test("connection requests cannot target self, hidden people, or an existing active pair", async () => {
  await expect(
    asUser(AVERY, () =>
      db.query(
        `insert into public.connection_requests (requester_id, recipient_id) values ('${AVERY}', '${AVERY}')`,
      ),
    ),
  ).rejects.toThrow();

  await expect(
    asUser(JORDAN, () =>
      db.query(
        `insert into public.connection_requests (requester_id, recipient_id) values ('${JORDAN}', '${SAM}')`,
      ),
    ),
  ).rejects.toThrow();

  await asUser(JORDAN, () =>
    db.query(
      `insert into public.connection_requests (requester_id, recipient_id, opener) values ('${JORDAN}', '${CASEY}', 'Want to study?')`,
    ),
  );
  await expect(
    asUser(CASEY, () =>
      db.query(
        `insert into public.connection_requests (requester_id, recipient_id) values ('${CASEY}', '${JORDAN}')`,
      ),
    ),
  ).rejects.toThrow();

  await expect(
    asUser(JORDAN, () =>
      db.query(
        `update public.connection_requests set status = 'accepted' where requester_id = '${JORDAN}' and recipient_id = '${CASEY}'`,
      ),
    ),
  ).rejects.toThrow();

  await asUser(CASEY, () =>
    db.query(
      `update public.connection_requests set status = 'declined' where requester_id = '${JORDAN}' and recipient_id = '${CASEY}'`,
    ),
  );

  expect(
    await asUser(JORDAN, () =>
      count(
        `select count(*)::int as count from public.connection_requests where requester_id = '${JORDAN}' and recipient_id = '${CASEY}'`,
      ),
    ),
  ).toBe(0);
  expect(
    await asUser(CASEY, () =>
      count(
        `select count(*)::int as count from public.connection_requests where requester_id = '${JORDAN}' and recipient_id = '${CASEY}'`,
      ),
    ),
  ).toBe(1);
});

test("private groups, drafts, and hidden RSVPs stay hidden", async () => {
  expect(
    await asUser(JORDAN, () =>
      count(`select count(*)::int as count from public.groups where id = '${PRIVATE_GROUP}'`),
    ),
  ).toBe(0);
  expect(
    await asUser(CASEY, () =>
      count(`select count(*)::int as count from public.groups where id = '${PRIVATE_GROUP}'`),
    ),
  ).toBe(1);

  expect(
    await asUser(JORDAN, () =>
      count(`select count(*)::int as count from public.events where id = '${PRIVATE_EVENT}'`),
    ),
  ).toBe(0);
  expect(
    await asUser(JORDAN, () =>
      count(`select count(*)::int as count from public.events where id = '${DRAFT_EVENT}'`),
    ),
  ).toBe(0);
  expect(
    await asUser(JORDAN, () =>
      count(`select count(*)::int as count from public.events where id = '${PUBLIC_EVENT}'`),
    ),
  ).toBe(1);

  expect(
    await asUser(AVERY, () =>
      count(
        `select count(*)::int as count from public.event_rsvps where event_id = '${PUBLIC_EVENT}' and profile_id = '${JORDAN}'`,
      ),
    ),
  ).toBe(0);
  expect(
    await asUser(CASEY, () =>
      count(
        `select count(*)::int as count from public.event_rsvps where event_id = '${PUBLIC_EVENT}' and profile_id = '${AVERY}'`,
      ),
    ),
  ).toBe(1);
});

test("messages are limited to an accepted, unblocked pair", async () => {
  expect(
    await asUser(JORDAN, () =>
      count(
        `select count(*)::int as count from public.messages where conversation_id = '${CONVERSATION}'`,
      ),
    ),
  ).toBe(1);
  expect(
    await asUser(CASEY, () =>
      count(
        `select count(*)::int as count from public.messages where conversation_id = '${CONVERSATION}'`,
      ),
    ),
  ).toBe(0);

  await expect(
    asUser(CASEY, () =>
      db.query(
        `insert into public.conversations (user_low_id, user_high_id) select least('${CASEY}'::uuid, '${JORDAN}'::uuid), greatest('${CASEY}'::uuid, '${JORDAN}'::uuid)`,
      ),
    ),
  ).rejects.toThrow(/permission denied/i);

  await asUser(AVERY, () =>
    db.query(
      `insert into public.blocks (blocker_id, blocked_id) values ('${AVERY}', '${JORDAN}')`,
    ),
  );
  expect(
    await asUser(JORDAN, () =>
      count(
        `select count(*)::int as count from public.messages where conversation_id = '${CONVERSATION}'`,
      ),
    ),
  ).toBe(0);
  await expect(
    asUser(AVERY, () =>
      db.query(
        `insert into public.messages (conversation_id, sender_id, body) values ('${CONVERSATION}', '${AVERY}', 'Still there?')`,
      ),
    ),
  ).rejects.toThrow();
  await db.exec(
    `delete from public.blocks where blocker_id = '${AVERY}' and blocked_id = '${JORDAN}'`,
  );
});

test("reports are visible to the reporter and moderators only", async () => {
  await asUser(JORDAN, () =>
    db.query(
      `insert into public.reports (reporter_id, subject_user_id, reason, details) values ('${JORDAN}', '${AVERY}', 'spam', 'Fixture report')`,
    ),
  );

  expect(await asUser(JORDAN, () => count("select count(*)::int as count from public.reports"))).toBe(
    1,
  );
  expect(await asUser(AVERY, () => count("select count(*)::int as count from public.reports"))).toBe(
    0,
  );
  expect(await asUser(QUINN, () => count("select count(*)::int as count from public.reports"))).toBe(
    1,
  );
});

test("profiles do not store a university email", async () => {
  const columns = await db.query<{ column_name: string }>(
    `select column_name from information_schema.columns where table_schema = 'public' and table_name = 'profiles'`,
  );

  expect(columns.rows.map((row) => row.column_name)).not.toContain("email");
});
