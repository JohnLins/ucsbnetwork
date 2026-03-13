-- Add cohort number for partners (nullable; only meaningful for partner member_type)
alter table public.members
  add column cohort integer;
