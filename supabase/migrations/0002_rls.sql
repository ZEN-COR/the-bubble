-- Row Level Security and authorization helpers.
-- SECURITY DEFINER functions pin search_path empty and check auth.uid() themselves.
-- Clients cannot insert connections or conversations. Accepting a request is milestone M2.

create or replace function public.is_verified_university_user()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from auth.users as account
    where account.id = (select auth.uid())
      and account.email_confirmed_at is not null
      and lower(split_part(account.email, '@', 2)) in (
        select domain from private.allowed_email_domains
      )
  );
$$;

create or replace function public.is_moderator()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles as profile
    where profile.id = (select auth.uid())
      and profile.app_role = 'moderator'
      and profile.status = 'active'
      and public.is_verified_university_user()
  );
$$;

create or replace function public.users_are_blocked(left_id uuid, right_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.blocks as block
    where (block.blocker_id = left_id and block.blocked_id = right_id)
      or (block.blocker_id = right_id and block.blocked_id = left_id)
  );
$$;

create or replace function public.can_view_profile(target uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select
    (select auth.uid()) is not null
    and public.is_verified_university_user()
    and (
      target = (select auth.uid())
      or (
        exists (
          select 1
          from public.profiles as profile
          where profile.id = target
            and profile.status = 'active'
            and (
              profile.discoverable
              or exists (
                select 1
                from public.connections as connection
                where connection.user_low_id = least((select auth.uid()), target)
                  and connection.user_high_id = greatest((select auth.uid()), target)
              )
            )
        )
        and not public.users_are_blocked((select auth.uid()), target)
      )
    );
$$;

-- Returns overlap only. Never returns the weekday values.
create or replace function public.profiles_share_opted_in_campus_day(
  left_id uuid,
  right_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select
    (select auth.uid()) in (left_id, right_id)
    and public.is_verified_university_user()
    and exists (
      select 1
      from public.profiles as left_profile
      join public.profiles as right_profile on true
      where left_profile.id = left_id
        and right_profile.id = right_id
        and left_profile.status = 'active'
        and right_profile.status = 'active'
        and left_profile.campus_day_visibility
        and right_profile.campus_day_visibility
        and exists (
          select 1
          from public.campus_days as left_day
          join public.campus_days as right_day
            on left_day.weekday = right_day.weekday
          where left_day.profile_id = left_id
            and right_day.profile_id = right_id
        )
    );
$$;

create or replace function public.visible_life_stage(target uuid)
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select case
    when (select auth.uid()) = target then profile.life_stage
    when profile.life_stage_opt_in and public.can_view_profile(target) then profile.life_stage
    else null
  end
  from public.profiles as profile
  where profile.id = target
    and public.can_view_profile(target);
$$;

create or replace function public.can_view_group(target uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.groups as community
    where community.id = target
      and public.is_verified_university_user()
      and (
        public.is_moderator()
        or community.privacy = 'public'
        or community.owner_id = (select auth.uid())
        or exists (
          select 1
          from public.group_members as member
          where member.group_id = community.id
            and member.profile_id = (select auth.uid())
            and member.status in ('active', 'invited')
        )
      )
  );
$$;

create or replace function public.can_read_event(target uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.events as event
    where event.id = target
      and public.is_verified_university_user()
      and (
        public.is_moderator()
        or event.creator_id = (select auth.uid())
        or (
          event.published
          and (
            event.group_id is null
            or exists (
              select 1
              from public.groups as community
              where community.id = event.group_id
                and community.privacy = 'public'
            )
            or exists (
              select 1
              from public.group_members as member
              where member.group_id = event.group_id
                and member.profile_id = (select auth.uid())
                and member.status in ('active', 'invited')
            )
          )
        )
      )
  );
$$;

create or replace function public.is_conversation_participant(target uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.conversations as conversation
    where conversation.id = target
      and (select auth.uid()) in (conversation.user_low_id, conversation.user_high_id)
      and public.is_verified_university_user()
      and not public.users_are_blocked(conversation.user_low_id, conversation.user_high_id)
  );
$$;

create or replace function public.can_send_message(target uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.conversations as conversation
    where conversation.id = target
      and public.is_conversation_participant(target)
      and exists (
        select 1
        from public.connections as connection
        where connection.user_low_id = conversation.user_low_id
          and connection.user_high_id = conversation.user_high_id
      )
  );
$$;

revoke all on function public.is_verified_university_user() from public;
revoke all on function public.is_moderator() from public;
revoke all on function public.users_are_blocked(uuid, uuid) from public;
revoke all on function public.can_view_profile(uuid) from public;
revoke all on function public.profiles_share_opted_in_campus_day(uuid, uuid) from public;
revoke all on function public.visible_life_stage(uuid) from public;
revoke all on function public.can_view_group(uuid) from public;
revoke all on function public.can_read_event(uuid) from public;
revoke all on function public.is_conversation_participant(uuid) from public;
revoke all on function public.can_send_message(uuid) from public;
revoke all on function public.set_updated_at() from public;

grant execute on function public.is_verified_university_user() to authenticated, service_role;
grant execute on function public.is_moderator() to authenticated, service_role;
grant execute on function public.users_are_blocked(uuid, uuid) to authenticated, service_role;
grant execute on function public.can_view_profile(uuid) to authenticated, service_role;
grant execute on function public.profiles_share_opted_in_campus_day(uuid, uuid) to authenticated, service_role;
grant execute on function public.visible_life_stage(uuid) to authenticated, service_role;
grant execute on function public.can_view_group(uuid) to authenticated, service_role;
grant execute on function public.can_read_event(uuid) to authenticated, service_role;
grant execute on function public.is_conversation_participant(uuid) to authenticated, service_role;
grant execute on function public.can_send_message(uuid) to authenticated, service_role;
grant execute on function public.set_updated_at() to authenticated, service_role;

grant usage on schema public to anon, authenticated, service_role;

grant select (
  id,
  display_name,
  bio,
  avatar_path,
  degree,
  major,
  meeting_preferences,
  discoverable,
  campus_day_visibility,
  life_stage_opt_in,
  onboarding_completed,
  status,
  created_at,
  updated_at
) on public.profiles to authenticated;

grant update (
  display_name,
  bio,
  avatar_path,
  degree,
  major,
  life_stage,
  meeting_preferences,
  discoverable,
  campus_day_visibility,
  life_stage_opt_in,
  onboarding_completed
) on public.profiles to authenticated;

create view public.profile_cards
with (security_invoker = true) as
select
  id,
  display_name,
  bio,
  avatar_path,
  degree,
  major,
  meeting_preferences,
  discoverable,
  onboarding_completed,
  life_stage_opt_in
from public.profiles;

grant select on public.profile_cards to authenticated;

grant select on public.courses, public.interests to authenticated;

grant select, insert, delete on public.profile_courses to authenticated;
grant select, insert, delete on public.profile_interests to authenticated;
grant select, insert, delete on public.campus_days to authenticated;

grant select on public.groups to authenticated;
grant insert (
  name,
  slug,
  description,
  category,
  privacy,
  owner_id
) on public.groups to authenticated;
grant update (
  name,
  slug,
  description,
  category,
  privacy
) on public.groups to authenticated;

grant select on public.group_members to authenticated;

grant select, insert on public.connection_requests to authenticated;
grant update (status) on public.connection_requests to authenticated;

grant select on public.connections to authenticated;
grant select on public.conversations to authenticated;

grant select, insert on public.messages to authenticated;

grant select on public.events to authenticated;
grant insert (
  creator_id,
  group_id,
  title,
  description,
  starts_at,
  ends_at,
  timezone,
  location_label,
  category,
  published
) on public.events to authenticated;
grant update (
  group_id,
  title,
  description,
  starts_at,
  ends_at,
  timezone,
  location_label,
  category,
  published
) on public.events to authenticated;

grant select, insert, delete on public.event_interests to authenticated;
grant select, insert, update, delete on public.event_rsvps to authenticated;

grant select, insert, delete on public.blocks to authenticated;

grant select, insert on public.reports to authenticated;
grant update (status) on public.reports to authenticated;

grant select on public.moderation_actions to authenticated;
grant insert (moderator_id, report_id, action) on public.moderation_actions to authenticated;

grant select, update on public.notification_preferences to authenticated;
grant select, update (read_at) on public.notifications to authenticated;

alter table public.profiles enable row level security;
alter table public.profile_courses enable row level security;
alter table public.profile_interests enable row level security;
alter table public.campus_days enable row level security;
alter table public.groups enable row level security;
alter table public.group_members enable row level security;
alter table public.connection_requests enable row level security;
alter table public.connections enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.events enable row level security;
alter table public.event_interests enable row level security;
alter table public.event_rsvps enable row level security;
alter table public.blocks enable row level security;
alter table public.reports enable row level security;
alter table public.moderation_actions enable row level security;
alter table public.notification_preferences enable row level security;
alter table public.notifications enable row level security;
alter table public.courses enable row level security;
alter table public.interests enable row level security;

create policy profiles_select on public.profiles
  for select to authenticated
  using (public.can_view_profile(id));

create policy profiles_update on public.profiles
  for update to authenticated
  using (id = (select auth.uid()) and public.is_verified_university_user())
  with check (id = (select auth.uid()) and public.is_verified_university_user());

create policy courses_select on public.courses
  for select to authenticated
  using (public.is_verified_university_user());

create policy interests_select on public.interests
  for select to authenticated
  using (public.is_verified_university_user());

create policy profile_courses_select on public.profile_courses
  for select to authenticated
  using (public.can_view_profile(profile_id));

create policy profile_courses_insert on public.profile_courses
  for insert to authenticated
  with check (
    profile_id = (select auth.uid())
    and public.is_verified_university_user()
  );

create policy profile_courses_delete on public.profile_courses
  for delete to authenticated
  using (
    profile_id = (select auth.uid())
    and public.is_verified_university_user()
  );

create policy profile_interests_select on public.profile_interests
  for select to authenticated
  using (public.can_view_profile(profile_id));

create policy profile_interests_insert on public.profile_interests
  for insert to authenticated
  with check (
    profile_id = (select auth.uid())
    and public.is_verified_university_user()
  );

create policy profile_interests_delete on public.profile_interests
  for delete to authenticated
  using (
    profile_id = (select auth.uid())
    and public.is_verified_university_user()
  );

create policy campus_days_owner on public.campus_days
  for all to authenticated
  using (
    profile_id = (select auth.uid())
    and public.is_verified_university_user()
  )
  with check (
    profile_id = (select auth.uid())
    and public.is_verified_university_user()
  );

create policy groups_select on public.groups
  for select to authenticated
  using (public.can_view_group(id));

create policy groups_insert on public.groups
  for insert to authenticated
  with check (
    owner_id = (select auth.uid())
    and verified_organizer = false
    and public.is_verified_university_user()
  );

create policy groups_update on public.groups
  for update to authenticated
  using (
    owner_id = (select auth.uid())
    and verified_organizer = false
    and public.is_verified_university_user()
  )
  with check (
    owner_id = (select auth.uid())
    and verified_organizer = false
    and public.is_verified_university_user()
  );

create policy group_members_select on public.group_members
  for select to authenticated
  using (
    profile_id = (select auth.uid())
    or (
      public.can_view_group(group_id)
      and status = 'active'
      and public.can_view_profile(profile_id)
    )
  );

create policy connection_requests_select on public.connection_requests
  for select to authenticated
  using (
    (
      requester_id = (select auth.uid())
      and status in ('pending', 'accepted')
    )
    or recipient_id = (select auth.uid())
  );

create policy connection_requests_insert on public.connection_requests
  for insert to authenticated
  with check (
    requester_id = (select auth.uid())
    and requester_id <> recipient_id
    and status = 'pending'
    and public.is_verified_university_user()
    and public.can_view_profile(recipient_id)
    and not public.users_are_blocked((select auth.uid()), recipient_id)
  );

create policy connection_requests_recipient_decline on public.connection_requests
  for update to authenticated
  using (
    recipient_id = (select auth.uid())
    and status = 'pending'
    and public.is_verified_university_user()
  )
  with check (
    recipient_id = (select auth.uid())
    and status = 'declined'
  );

create policy connection_requests_requester_cancel on public.connection_requests
  for update to authenticated
  using (
    requester_id = (select auth.uid())
    and status = 'pending'
    and public.is_verified_university_user()
  )
  with check (
    requester_id = (select auth.uid())
    and status = 'cancelled'
  );

create policy connections_select on public.connections
  for select to authenticated
  using (
    (select auth.uid()) in (user_low_id, user_high_id)
    and public.is_verified_university_user()
    and not public.users_are_blocked(user_low_id, user_high_id)
  );

create policy conversations_select on public.conversations
  for select to authenticated
  using (
    (select auth.uid()) in (user_low_id, user_high_id)
    and public.is_verified_university_user()
    and not public.users_are_blocked(user_low_id, user_high_id)
  );

create policy messages_select on public.messages
  for select to authenticated
  using (public.is_conversation_participant(conversation_id));

create policy messages_insert on public.messages
  for insert to authenticated
  with check (
    sender_id = (select auth.uid())
    and public.can_send_message(conversation_id)
  );

create policy events_select on public.events
  for select to authenticated
  using (public.can_read_event(id));

create policy events_insert on public.events
  for insert to authenticated
  with check (
    creator_id = (select auth.uid())
    and organizer_verified = false
    and public.is_verified_university_user()
    and (
      group_id is null
      or public.can_view_group(group_id)
    )
  );

create policy events_update on public.events
  for update to authenticated
  using (
    creator_id = (select auth.uid())
    and organizer_verified = false
    and public.is_verified_university_user()
  )
  with check (
    creator_id = (select auth.uid())
    and organizer_verified = false
    and public.is_verified_university_user()
  );

create policy event_interests_select on public.event_interests
  for select to authenticated
  using (public.can_read_event(event_id));

create policy event_interests_write on public.event_interests
  for insert to authenticated
  with check (
    public.is_verified_university_user()
    and exists (
      select 1
      from public.events as event
      where event.id = event_id
        and event.creator_id = (select auth.uid())
        and event.organizer_verified = false
    )
  );

create policy event_interests_delete on public.event_interests
  for delete to authenticated
  using (
    exists (
      select 1
      from public.events as event
      where event.id = event_id
        and event.creator_id = (select auth.uid())
        and event.organizer_verified = false
    )
  );

create policy event_rsvps_select on public.event_rsvps
  for select to authenticated
  using (
    profile_id = (select auth.uid())
    or (
      visible_to_attendees
      and public.can_read_event(event_id)
      and public.can_view_profile(profile_id)
    )
  );

create policy event_rsvps_insert on public.event_rsvps
  for insert to authenticated
  with check (
    profile_id = (select auth.uid())
    and public.can_read_event(event_id)
  );

create policy event_rsvps_update on public.event_rsvps
  for update to authenticated
  using (profile_id = (select auth.uid()) and public.is_verified_university_user())
  with check (
    profile_id = (select auth.uid())
    and public.is_verified_university_user()
    and public.can_read_event(event_id)
  );

create policy event_rsvps_delete on public.event_rsvps
  for delete to authenticated
  using (profile_id = (select auth.uid()) and public.is_verified_university_user());

create policy blocks_select on public.blocks
  for select to authenticated
  using (blocker_id = (select auth.uid()));

create policy blocks_insert on public.blocks
  for insert to authenticated
  with check (
    blocker_id = (select auth.uid())
    and blocker_id <> blocked_id
    and public.is_verified_university_user()
  );

create policy blocks_delete on public.blocks
  for delete to authenticated
  using (blocker_id = (select auth.uid()) and public.is_verified_university_user());

create policy reports_select on public.reports
  for select to authenticated
  using (
    reporter_id = (select auth.uid())
    or public.is_moderator()
  );

create policy reports_insert on public.reports
  for insert to authenticated
  with check (
    reporter_id = (select auth.uid())
    and status = 'open'
    and public.is_verified_university_user()
  );

create policy reports_moderator_update on public.reports
  for update to authenticated
  using (public.is_moderator())
  with check (public.is_moderator());

create policy moderation_actions_select on public.moderation_actions
  for select to authenticated
  using (public.is_moderator());

create policy moderation_actions_insert on public.moderation_actions
  for insert to authenticated
  with check (
    moderator_id = (select auth.uid())
    and public.is_moderator()
  );

create policy notification_preferences_owner on public.notification_preferences
  for all to authenticated
  using (profile_id = (select auth.uid()) and public.is_verified_university_user())
  with check (profile_id = (select auth.uid()) and public.is_verified_university_user());

create policy notifications_select on public.notifications
  for select to authenticated
  using (profile_id = (select auth.uid()) and public.is_verified_university_user());

create policy notifications_update on public.notifications
  for update to authenticated
  using (profile_id = (select auth.uid()) and public.is_verified_university_user())
  with check (profile_id = (select auth.uid()) and public.is_verified_university_user());
