alter table public.admin_users enable row level security;
alter table public.tags enable row level security;
alter table public.members enable row level security;
alter table public.member_links enable row level security;
alter table public.member_tags enable row level security;
alter table public.applications enable row level security;
alter table public.application_links enable row level security;
alter table public.application_tags enable row level security;
alter table public.submission_audit enable row level security;

drop policy if exists "public tags read" on public.tags;
create policy "public tags read"
on public.tags
for select
using (is_active = true);

drop policy if exists "admin tags all" on public.tags;
create policy "admin tags all"
on public.tags
for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "public members read" on public.members;
create policy "public members read"
on public.members
for select
using (is_published = true and archived_at is null);

drop policy if exists "admin members all" on public.members;
create policy "admin members all"
on public.members
for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "public member links read" on public.member_links;
create policy "public member links read"
on public.member_links
for select
using (
  exists (
    select 1
    from public.members
    where members.id = member_links.member_id
      and members.is_published = true
      and members.archived_at is null
  )
);

drop policy if exists "admin member links all" on public.member_links;
create policy "admin member links all"
on public.member_links
for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "public member tags read" on public.member_tags;
create policy "public member tags read"
on public.member_tags
for select
using (
  exists (
    select 1
    from public.members
    where members.id = member_tags.member_id
      and members.is_published = true
      and members.archived_at is null
  )
);

drop policy if exists "admin member tags all" on public.member_tags;
create policy "admin member tags all"
on public.member_tags
for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "admin applications all" on public.applications;
create policy "admin applications all"
on public.applications
for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "admin application links all" on public.application_links;
create policy "admin application links all"
on public.application_links
for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "admin application tags all" on public.application_tags;
create policy "admin application tags all"
on public.application_tags
for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "admin submission audit all" on public.submission_audit;
create policy "admin submission audit all"
on public.submission_audit
for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "admin users select" on public.admin_users;
create policy "admin users select"
on public.admin_users
for select
using (public.is_admin());
