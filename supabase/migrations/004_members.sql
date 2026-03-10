create table if not exists public.members (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  full_name text not null,
  first_name text,
  last_name text,
  headline text,
  company_or_org text,
  location text,
  bio text not null,
  website_url text,
  is_published boolean not null default false,
  sort_name text not null,
  approved_application_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz,
  archived_at timestamptz
);

create table if not exists public.member_links (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.members(id) on delete cascade,
  link_type text not null check (link_type in ('website', 'linkedin', 'github', 'x', 'other')),
  label text,
  url text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.member_tags (
  member_id uuid not null references public.members(id) on delete cascade,
  tag_id uuid not null references public.tags(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (member_id, tag_id)
);

drop trigger if exists set_members_updated_at on public.members;
create trigger set_members_updated_at
before update on public.members
for each row
execute procedure public.set_updated_at();
