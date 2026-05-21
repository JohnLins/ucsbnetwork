-- Add review state to hackathon signups so the admin UI can accept or
-- reject outside-builder applicants and track who reviewed them.

alter table public.hackathon_signups
  add column if not exists status text
    not null
    default 'pending'
    check (status in ('pending', 'accepted', 'rejected'));

alter table public.hackathon_signups
  add column if not exists reviewed_at timestamptz;

alter table public.hackathon_signups
  add column if not exists reviewed_by_admin_email text;

alter table public.hackathon_signups
  add column if not exists review_notes text;

create index if not exists hackathon_signups_status_idx
  on public.hackathon_signups (status);
