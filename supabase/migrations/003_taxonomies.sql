create table if not exists public.tags (
  id uuid primary key default gen_random_uuid(),
  tag_type text not null check (tag_type in ('role', 'domain', 'keyword')),
  name text not null,
  slug text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (tag_type, slug)
);
