-- Add member_type to distinguish regular members from advisors (alumni, faculty, etc.)
alter table public.members
add column member_type text not null default 'member'
check (member_type in ('member', 'advisor'));
