create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  full_name text not null,
  email citext not null,
  phone text,
  ucsb_affiliation_type text not null,
  ucsb_affiliation_detail text not null,
  graduation_year int check (graduation_year between 1950 and 2100),
  current_title text not null,
  company_or_org text,
  location text,
  website_url text,
  bio text not null,
  what_you_can_help_with text,
  what_you_are_looking_for text,
  why_join text not null,
  consent_to_publish boolean not null,
  review_notes text,
  reviewed_by_admin_email citext,
  approved_member_id uuid,
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz
);

create table if not exists public.application_links (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications(id) on delete cascade,
  link_type text not null check (link_type in ('website', 'linkedin', 'github', 'x', 'other')),
  label text,
  url text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.application_tags (
  application_id uuid not null references public.applications(id) on delete cascade,
  tag_id uuid not null references public.tags(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (application_id, tag_id)
);

create table if not exists public.submission_audit (
  id uuid primary key default gen_random_uuid(),
  email_hash text not null,
  ip_hash text not null,
  submitted_at timestamptz not null default now()
);

alter table public.members
  add constraint members_approved_application_id_fkey
  foreign key (approved_application_id)
  references public.applications(id)
  on delete set null;

alter table public.applications
  add constraint applications_approved_member_id_fkey
  foreign key (approved_member_id)
  references public.members(id)
  on delete set null;
