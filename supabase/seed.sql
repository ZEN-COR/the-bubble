-- Local development fixtures only. Do not run this against production.
-- Students, groups, and events are fictional.
-- example.test is a local allowlist entry so fixtures can sign in. Remove it before any real deployment.
-- The auth user block runs only when Supabase's auth.users.encrypted_password column exists.
-- It was not executed in the M0 test run. See IMPLEMENTATION_STATUS.md.

insert into private.allowed_email_domains (domain)
values ('example.test')
on conflict (domain) do nothing;

insert into public.courses (id, code, title)
values
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 'COMP261', 'Algorithms and Data Structures'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2', 'COMP307', 'Introduction to Artificial Intelligence'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa3', 'STAT193', 'Statistics for Natural Sciences')
on conflict (code) do nothing;

insert into public.interests (id, slug, label)
values
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1', 'algorithms', 'Algorithms'),
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2', 'board-games', 'Board games'),
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb3', 'hiking', 'Hiking'),
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb4', 'evening-study', 'Evening study')
on conflict (slug) do nothing;

do $$
begin
  if not exists (
    select 1
    from information_schema.columns
    where table_schema = 'auth'
      and table_name = 'users'
      and column_name = 'encrypted_password'
  ) then
    raise notice 'Skipping fictional auth users: auth.users is not the Supabase auth schema.';
    return;
  end if;

  create extension if not exists pgcrypto;

  insert into auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  )
  values
    (
      '00000000-0000-0000-0000-000000000000',
      '11111111-1111-4111-8111-111111111111',
      'authenticated',
      'authenticated',
      'avery.chen@example.test',
      crypt('fixture-password', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{}',
      now(),
      now(),
      '',
      '',
      '',
      ''
    ),
    (
      '00000000-0000-0000-0000-000000000000',
      '22222222-2222-4222-8222-222222222222',
      'authenticated',
      'authenticated',
      'jordan.blake@example.test',
      crypt('fixture-password', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{}',
      now(),
      now(),
      '',
      '',
      '',
      ''
    ),
    (
      '00000000-0000-0000-0000-000000000000',
      '33333333-3333-4333-8333-333333333333',
      'authenticated',
      'authenticated',
      'sam.patel@example.test',
      crypt('fixture-password', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{}',
      now(),
      now(),
      '',
      '',
      '',
      ''
    ),
    (
      '00000000-0000-0000-0000-000000000000',
      '44444444-4444-4444-8444-444444444444',
      'authenticated',
      'authenticated',
      'riley.nguyen@example.test',
      crypt('fixture-password', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{}',
      now(),
      now(),
      '',
      '',
      '',
      ''
    ),
    (
      '00000000-0000-0000-0000-000000000000',
      '55555555-5555-4555-8555-555555555555',
      'authenticated',
      'authenticated',
      'quinn.okonkwo@example.test',
      crypt('fixture-password', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{}',
      now(),
      now(),
      '',
      '',
      '',
      ''
    ),
    (
      '00000000-0000-0000-0000-000000000000',
      '66666666-6666-4666-8666-666666666666',
      'authenticated',
      'authenticated',
      'casey.morgan@example.test',
      crypt('fixture-password', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{}',
      now(),
      now(),
      '',
      '',
      '',
      ''
    )
  on conflict (id) do nothing;

  insert into auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    last_sign_in_at,
    created_at,
    updated_at
  )
  select
    account.id,
    account.id,
    jsonb_build_object('sub', account.id::text, 'email', account.email),
    'email',
    account.id::text,
    now(),
    now(),
    now()
  from auth.users as account
  where account.email like '%@example.test'
  on conflict (id) do nothing;

  update public.profiles
  set
    display_name = 'Avery Chen',
    degree = 'BSc',
    major = 'Computer Science',
    bio = 'Looking for a calm study partner for algorithms.',
    discoverable = true,
    campus_day_visibility = true,
    onboarding_completed = true,
    meeting_preferences = 'Weekday afternoons on campus'
  where id = '11111111-1111-4111-8111-111111111111';

  update public.profiles
  set
    display_name = 'Jordan Blake',
    degree = 'BSc',
    major = 'Computer Science',
    bio = 'Happy to meet in a public campus space.',
    discoverable = true,
    campus_day_visibility = true,
    onboarding_completed = true,
    meeting_preferences = 'Late afternoons'
  where id = '22222222-2222-4222-8222-222222222222';

  update public.profiles
  set
    display_name = 'Sam Patel',
    degree = 'BA',
    major = 'Statistics',
    bio = 'Keeping my profile hidden while I settle in.',
    discoverable = false,
    onboarding_completed = true
  where id = '33333333-3333-4333-8333-333333333333';

  update public.profiles
  set
    display_name = 'Riley Nguyen',
    discoverable = true,
    status = 'suspended',
    onboarding_completed = true
  where id = '44444444-4444-4444-8444-444444444444';

  update public.profiles
  set
    display_name = 'Quinn Okonkwo',
    discoverable = false,
    app_role = 'moderator',
    onboarding_completed = true
  where id = '55555555-5555-4555-8555-555555555555';

  update public.profiles
  set
    display_name = 'Casey Morgan',
    degree = 'BCom',
    major = 'Information Systems',
    bio = 'Part-time student, mostly on campus in the evening.',
    discoverable = true,
    life_stage = 'Returning student',
    life_stage_opt_in = true,
    onboarding_completed = true,
    meeting_preferences = 'Evenings and weekends'
  where id = '66666666-6666-4666-8666-666666666666';

  insert into public.profile_courses (profile_id, course_id)
  values
    ('11111111-1111-4111-8111-111111111111', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1'),
    ('11111111-1111-4111-8111-111111111111', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2'),
    ('22222222-2222-4222-8222-222222222222', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1'),
    ('66666666-6666-4666-8666-666666666666', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa3')
  on conflict do nothing;

  insert into public.profile_interests (profile_id, interest_id)
  values
    ('11111111-1111-4111-8111-111111111111', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1'),
    ('11111111-1111-4111-8111-111111111111', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2'),
    ('22222222-2222-4222-8222-222222222222', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1'),
    ('22222222-2222-4222-8222-222222222222', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb3'),
    ('66666666-6666-4666-8666-666666666666', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb4')
  on conflict do nothing;

  insert into public.campus_days (profile_id, weekday)
  values
    ('11111111-1111-4111-8111-111111111111', 1),
    ('11111111-1111-4111-8111-111111111111', 3),
    ('22222222-2222-4222-8222-222222222222', 1),
    ('22222222-2222-4222-8222-222222222222', 4)
  on conflict do nothing;

  insert into public.groups (
    id, name, slug, description, category, privacy, owner_id, verified_organizer
  )
  values
    (
      'cccccccc-cccc-4ccc-8ccc-ccccccccccc1',
      'COMP261 study circle',
      'comp261-study-circle',
      'A student-run group for working through algorithms problems together.',
      'course_study',
      'public',
      '11111111-1111-4111-8111-111111111111',
      false
    ),
    (
      'cccccccc-cccc-4ccc-8ccc-ccccccccccc2',
      'Evening commuters',
      'evening-commuters',
      'Private planning space for students who are on campus later in the day.',
      'interest',
      'private',
      '66666666-6666-4666-8666-666666666666',
      false
    )
  on conflict (slug) do nothing;

  insert into public.group_members (group_id, profile_id, role, status)
  values
    (
      'cccccccc-cccc-4ccc-8ccc-ccccccccccc1',
      '11111111-1111-4111-8111-111111111111',
      'owner',
      'active'
    ),
    (
      'cccccccc-cccc-4ccc-8ccc-ccccccccccc1',
      '22222222-2222-4222-8222-222222222222',
      'member',
      'active'
    ),
    (
      'cccccccc-cccc-4ccc-8ccc-ccccccccccc2',
      '66666666-6666-4666-8666-666666666666',
      'owner',
      'active'
    )
  on conflict do nothing;

  insert into public.events (
    id,
    creator_id,
    group_id,
    title,
    description,
    starts_at,
    ends_at,
    timezone,
    location_label,
    category,
    published,
    organizer_verified
  )
  values
    (
      'dddddddd-dddd-4ddd-8ddd-ddddddddddd1',
      '11111111-1111-4111-8111-111111111111',
      'cccccccc-cccc-4ccc-8ccc-ccccccccccc1',
      'Algorithms catch-up',
      'A student-created session. The organizer is not a verified club.',
      '2026-11-03 17:30:00+13',
      '2026-11-03 19:00:00+13',
      'Pacific/Auckland',
      'Kelburn campus, library foyer',
      'study',
      true,
      false
    ),
    (
      'dddddddd-dddd-4ddd-8ddd-ddddddddddd2',
      '66666666-6666-4666-8666-666666666666',
      'cccccccc-cccc-4ccc-8ccc-ccccccccccc2',
      'Weekend planning chat',
      'Visible only to evening commuters.',
      '2026-11-07 10:00:00+13',
      '2026-11-07 11:30:00+13',
      'Pacific/Auckland',
      'Kelburn campus, quad benches',
      'social',
      true,
      false
    ),
    (
      'dddddddd-dddd-4ddd-8ddd-ddddddddddd3',
      '11111111-1111-4111-8111-111111111111',
      null,
      'Draft board-game afternoon',
      'Unpublished draft. Other students should not see this.',
      '2026-11-14 14:00:00+13',
      '2026-11-14 16:00:00+13',
      'Pacific/Auckland',
      'Kelburn campus, student union lounge',
      'social',
      false,
      false
    )
  on conflict (id) do nothing;

  insert into public.event_interests (event_id, interest_id)
  values
    ('dddddddd-dddd-4ddd-8ddd-ddddddddddd1', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1'),
    ('dddddddd-dddd-4ddd-8ddd-ddddddddddd3', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2')
  on conflict do nothing;

  insert into public.event_rsvps (event_id, profile_id, status, visible_to_attendees)
  values
    ('dddddddd-dddd-4ddd-8ddd-ddddddddddd1', '11111111-1111-4111-8111-111111111111', 'going', true),
    ('dddddddd-dddd-4ddd-8ddd-ddddddddddd1', '22222222-2222-4222-8222-222222222222', 'going', false)
  on conflict do nothing;
end
$$;
