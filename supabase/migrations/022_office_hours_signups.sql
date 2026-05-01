-- Public office-hours signup (directors meet UCSB builders; submissions via server route only).

create table if not exists public.office_hours_signups (
  id uuid primary key default gen_random_uuid(),
  names text not null,
  phone text not null,
  relevant_links text,
  project text not null,
  ip_hash text,
  phone_hash text,
  created_at timestamptz not null default now()
);

create index if not exists office_hours_signups_created_at_idx
  on public.office_hours_signups (created_at desc);

create index if not exists office_hours_signups_phone_hash_idx
  on public.office_hours_signups (phone_hash);

alter table public.office_hours_signups enable row level security;

drop policy if exists office_hours_signups_no_access on public.office_hours_signups;
create policy office_hours_signups_no_access
  on public.office_hours_signups
  for all
  to authenticated
  using (false)
  with check (false);
