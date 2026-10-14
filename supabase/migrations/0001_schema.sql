-- The Bubble foundation schema.
-- Apply on Supabase Postgres. auth.users and auth.uid() are provided by Supabase Auth.
-- Email domains are data, not a hardcoded university policy. See private.allowed_email_domains.

do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'anon') then
    create role anon nologin;
  end if;
  if not exists (select 1 from pg_roles where rolname = 'authenticated') then
    create role authenticated nologin;
  end if;
  if not exists (select 1 from pg_roles where rolname = 'service_role') then
    create role service_role nologin bypassrls;
  end if;
end
$$;

create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to service_role;

create table private.allowed_email_domains (
  domain text primary key,
  constraint allowed_email_domains_lowercase check (domain = lower(domain)),
  constraint allowed_email_domains_shape check (
    domain ~ '^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$'
  )
);

alter table private.allowed_email_domains enable row level security;
revoke all on private.allowed_email_domains from public, anon, authenticated;

create type public.profile_status as enum ('active', 'suspended');
create type public.app_role as enum ('student', 'moderator');
create type public.group_category as enum (
  'course_study',
  'interest',
  'club',
  'project',
  'other'
);
create type public.group_privacy as enum ('public', 'private');
create type public.group_role as enum ('owner', 'moderator', 'member');
create type public.membership_status as enum ('active', 'invited');
create type public.connection_status as enum (
  'pending',
  'accepted',
  'declined',
  'cancelled'
);
create type public.rsvp_status as enum ('going', 'not_going');
create type public.report_reason as enum (
  'harassment',
  'impersonation',
  'spam',
  'inappropriate_content',
  'other'
);
create type public.report_status as enum ('open', 'triaged', 'resolved');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  bio text,
  avatar_path text,
  degree text,
  major text,
  life_stage text,
  meeting_preferences text,
  discoverable boolean not null default false,
  campus_day_visibility boolean not null default false,
  life_stage_opt_in boolean not null default false,
  onboarding_completed boolean not null default false,
  status public.profile_status not null default 'active',
  app_role public.app_role not null default 'student',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_display_name_len check (
    display_name is null or char_length(btrim(display_name)) between 1 and 40
  ),
  constraint profiles_bio_len check (bio is null or char_length(bio) <= 280),
  constraint profiles_degree_len check (degree is null or char_length(degree) <= 80),
  constraint profiles_major_len check (major is null or char_length(major) <= 80),
  constraint profiles_life_stage_len check (
    life_stage is null or char_length(life_stage) <= 40
  ),
  constraint profiles_meeting_preferences_len check (
    meeting_preferences is null or char_length(meeting_preferences) <= 200
  ),
  constraint profiles_avatar_path_safe check (
    avatar_path is null
    or (
      char_length(avatar_path) between 1 and 200
      and avatar_path !~ '\.\.'
      and avatar_path !~ '://'
    )
  )
);

create table public.courses (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  title text not null,
  constraint courses_code_shape check (code ~ '^[A-Z]{3,4}[0-9]{3}$'),
  constraint courses_title_len check (char_length(title) between 1 and 120)
);

create table public.profile_courses (
  profile_id uuid not null references public.profiles (id) on delete cascade,
  course_id uuid not null references public.courses (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (profile_id, course_id)
);

create table public.interests (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  label text not null,
  constraint interests_slug_shape check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  constraint interests_label_len check (char_length(label) between 1 and 40)
);

create table public.profile_interests (
  profile_id uuid not null references public.profiles (id) on delete cascade,
  interest_id uuid not null references public.interests (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (profile_id, interest_id)
);

-- Weekday uses ISO numbering: 1 Monday through 7 Sunday.
create table public.campus_days (
  profile_id uuid not null references public.profiles (id) on delete cascade,
  weekday smallint not null,
  created_at timestamptz not null default now(),
  primary key (profile_id, weekday),
  constraint campus_days_weekday_range check (weekday between 1 and 7)
);

create table public.groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null default '',
  category public.group_category not null,
  privacy public.group_privacy not null default 'public',
  owner_id uuid not null references public.profiles (id) on delete restrict,
  verified_organizer boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint groups_name_len check (char_length(btrim(name)) between 1 and 80),
  constraint groups_slug_shape check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  constraint groups_description_len check (char_length(description) <= 2000)
);

create table public.group_members (
  group_id uuid not null references public.groups (id) on delete cascade,
  profile_id uuid not null references public.profiles (id) on delete cascade,
  role public.group_role not null,
  status public.membership_status not null default 'active',
  created_at timestamptz not null default now(),
  primary key (group_id, profile_id)
);

create table public.connection_requests (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references public.profiles (id) on delete cascade,
  recipient_id uuid not null references public.profiles (id) on delete cascade,
  status public.connection_status not null default 'pending',
  opener text,
  created_at timestamptz not null default now(),
  responded_at timestamptz,
  constraint connection_requests_no_self check (requester_id <> recipient_id),
  constraint connection_requests_opener_len check (
    opener is null or char_length(opener) <= 280
  )
);

create unique index connection_requests_one_active_pair
  on public.connection_requests (
    least(requester_id, recipient_id),
    greatest(requester_id, recipient_id)
  )
  where status in ('pending', 'accepted');

create table public.connections (
  id uuid primary key default gen_random_uuid(),
  user_low_id uuid not null references public.profiles (id) on delete cascade,
  user_high_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint connections_ordered check (user_low_id < user_high_id),
  constraint connections_pair_unique unique (user_low_id, user_high_id)
);

create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  user_low_id uuid not null references public.profiles (id) on delete cascade,
  user_high_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint conversations_ordered check (user_low_id < user_high_id),
  constraint conversations_pair_unique unique (user_low_id, user_high_id)
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  sender_id uuid not null references public.profiles (id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint messages_body_len check (char_length(btrim(body)) between 1 and 2000)
);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references public.profiles (id) on delete cascade,
  group_id uuid references public.groups (id) on delete set null,
  title text not null,
  description text not null default '',
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  timezone text not null,
  location_label text not null,
  category text,
  published boolean not null default false,
  organizer_verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint events_title_len check (char_length(btrim(title)) between 1 and 120),
  constraint events_description_len check (char_length(description) <= 4000),
  constraint events_timezone_len check (char_length(timezone) between 1 and 64),
  constraint events_location_len check (char_length(btrim(location_label)) between 1 and 160),
  constraint events_category_len check (category is null or char_length(category) <= 40),
  constraint events_time_order check (ends_at > starts_at)
);

create table public.event_interests (
  event_id uuid not null references public.events (id) on delete cascade,
  interest_id uuid not null references public.interests (id) on delete cascade,
  primary key (event_id, interest_id)
);

create table public.event_rsvps (
  event_id uuid not null references public.events (id) on delete cascade,
  profile_id uuid not null references public.profiles (id) on delete cascade,
  status public.rsvp_status not null,
  visible_to_attendees boolean not null default false,
  created_at timestamptz not null default now(),
  primary key (event_id, profile_id)
);

create table public.blocks (
  blocker_id uuid not null references public.profiles (id) on delete cascade,
  blocked_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (blocker_id, blocked_id),
  constraint blocks_no_self check (blocker_id <> blocked_id)
);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles (id) on delete cascade,
  subject_user_id uuid references public.profiles (id) on delete set null,
  subject_event_id uuid references public.events (id) on delete set null,
  reason public.report_reason not null,
  details text not null default '',
  status public.report_status not null default 'open',
  created_at timestamptz not null default now(),
  constraint reports_details_len check (char_length(details) <= 2000),
  constraint reports_has_subject check (
    subject_user_id is not null or subject_event_id is not null
  )
);

create table public.moderation_actions (
  id uuid primary key default gen_random_uuid(),
  moderator_id uuid not null references public.profiles (id) on delete restrict,
  report_id uuid not null references public.reports (id) on delete cascade,
  action text not null,
  created_at timestamptz not null default now(),
  constraint moderation_actions_len check (char_length(action) between 1 and 80)
);

create table public.notification_preferences (
  profile_id uuid primary key references public.profiles (id) on delete cascade,
  event_alerts boolean not null default true,
  connection_alerts boolean not null default true,
  messages_alerts boolean not null default true,
  paused_until timestamptz,
  updated_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  type text not null,
  payload jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default now(),
  constraint notifications_type_len check (char_length(type) between 1 and 64)
);

create index profile_courses_course_id_idx on public.profile_courses (course_id);
create index profile_interests_interest_id_idx on public.profile_interests (interest_id);
create index campus_days_weekday_idx on public.campus_days (weekday);
create index group_members_profile_id_idx on public.group_members (profile_id);
create index groups_privacy_idx on public.groups (privacy);
create index connection_requests_recipient_idx
  on public.connection_requests (recipient_id, status);
create index messages_conversation_created_idx
  on public.messages (conversation_id, created_at);
create index events_upcoming_idx on public.events (starts_at) where published;
create index event_rsvps_profile_id_idx on public.event_rsvps (profile_id);
create index blocks_blocked_id_idx on public.blocks (blocked_id);
create index reports_status_created_idx on public.reports (status, created_at);
create index notifications_profile_created_idx
  on public.notifications (profile_id, created_at);
create index profiles_discoverable_idx
  on public.profiles (id)
  where discoverable and status = 'active';

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger groups_set_updated_at
  before update on public.groups
  for each row execute function public.set_updated_at();

create trigger events_set_updated_at
  before update on public.events
  for each row execute function public.set_updated_at();

create trigger notification_preferences_set_updated_at
  before update on public.notification_preferences
  for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id) values (new.id);
  insert into public.notification_preferences (profile_id) values (new.id);
  return new;
end;
$$;

revoke all on function public.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

do $$
begin
  if exists (select 1 from pg_roles where rolname = 'supabase_auth_admin') then
    grant execute on function public.handle_new_user() to supabase_auth_admin;
  end if;
end
$$;
