-- Add a "referred by" free-text field to applications
alter table public.applications
  add column if not exists referred_by text;
