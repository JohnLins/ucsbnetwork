-- Events system: events table + event_rsvps table

create table public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  location text not null default '',
  event_date timestamptz not null,
  end_date timestamptz,
  image_url text,
  external_url text,
  sponsor text,
  max_capacity int,
  visibility text not null default 'all'
    check (visibility in ('all', 'partners_only', 'advisors_only', 'partners_and_advisors')),
  rsvp_mode text not null default 'open'
    check (rsvp_mode in ('open', 'invite_only', 'closed')),
  rsvp_open_to text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.event_rsvps (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  member_id uuid not null references public.members(id) on delete cascade,
  status text not null default 'going'
    check (status in ('going', 'maybe', 'not_going')),
  invited boolean not null default false,
  created_at timestamptz not null default now(),
  unique (event_id, member_id)
);

-- Seed: Cohort 1 Welcome Dinner
insert into public.events (title, description, location, event_date, image_url, sponsor, visibility, rsvp_mode, rsvp_open_to)
values (
  'Cohort 1 Welcome Dinner',
  'The inaugural gathering of ucsb.network Cohort 1 partners. Come meet your fellow builders and kick off the network.',
  'TBD — Santa Barbara',
  '2026-04-15T18:30:00-07:00',
  '/cursor.png',
  'Cursor',
  'partners_only',
  'open',
  '{partner}'
);
