-- Track whether a hackathon signup is solo or part of a team, and the
-- list of teammates if applicable. Teammates is freeform text (names,
-- emails, handles) because outside builders won't all have accounts.

alter table public.hackathon_signups
  add column if not exists team_status text
    not null
    default 'solo'
    check (team_status in ('solo', 'team'));

alter table public.hackathon_signups
  add column if not exists teammates text;
