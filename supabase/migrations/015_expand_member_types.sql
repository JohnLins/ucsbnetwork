-- Expand member_type from 2 values (member, advisor) to 4 tiers.
-- Drop the old check constraint and add the new one.

-- The constraint was added inline, so its auto-generated name varies.
-- Drop all check constraints on member_type to be safe.
do $$
declare
  r record;
begin
  for r in
    select con.conname
    from pg_constraint con
    join pg_attribute att on att.attnum = any(con.conkey) and att.attrelid = con.conrelid
    where con.conrelid = 'public.members'::regclass
      and att.attname = 'member_type'
      and con.contype = 'c'
  loop
    execute format('alter table public.members drop constraint %I', r.conname);
  end loop;
end;
$$;

-- Add the new check constraint with four tiers
alter table public.members
  add constraint members_member_type_check
  check (member_type in ('partner', 'member', 'alumni_advisor', 'alumni_network'));

-- Remap existing data: advisor -> alumni_advisor, member -> partner
update public.members set member_type = 'alumni_advisor' where member_type = 'advisor';
update public.members set member_type = 'partner' where member_type = 'member';
