-- Allow free-text year values like "1st year", "2nd year", etc.
alter table public.applications
  drop constraint if exists applications_graduation_year_check;

alter table public.applications
  alter column graduation_year type text using graduation_year::text;
