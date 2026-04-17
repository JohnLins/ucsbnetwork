-- Public hackathon signup collection for outside UCSB builders
-- (Cohort members automatically qualify for the hackathon via normal member events.)

create table if not exists public.hackathon_signups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  school text,
  pitch text not null,
  link text,
  ip_hash text,
  email_hash text,
  created_at timestamptz not null default now()
);

create index if not exists hackathon_signups_created_at_idx
  on public.hackathon_signups (created_at desc);

create index if not exists hackathon_signups_email_hash_idx
  on public.hackathon_signups (email_hash);

alter table public.hackathon_signups enable row level security;

-- No anon or authed-level policies: only the service role (admin UI)
-- reads and writes this table. All public writes happen via a server route
-- using the service role client.

-- RLS deny-all for authed users; admins read via service role.
drop policy if exists hackathon_signups_no_access on public.hackathon_signups;
create policy hackathon_signups_no_access
  on public.hackathon_signups
  for all
  to authenticated
  using (false)
  with check (false);
