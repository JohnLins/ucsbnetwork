-- Add optional resume/portfolio upload path to applications
alter table public.applications
  add column if not exists resume_url text;

-- Create a private storage bucket for application uploads
insert into storage.buckets (id, name, public)
values ('application-uploads', 'application-uploads', false)
on conflict (id) do nothing;
