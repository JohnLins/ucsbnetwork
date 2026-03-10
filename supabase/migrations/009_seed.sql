insert into public.admin_users (email)
values ('hurshshah483@gmail.com')
on conflict (email) do nothing;

insert into public.tags (tag_type, name, slug)
values
  ('role', 'SWE', 'swe'),
  ('role', 'Founder', 'founder'),
  ('role', 'VC', 'vc'),
  ('role', 'Quant', 'quant'),
  ('role', 'Designer', 'designer'),
  ('role', 'PM', 'pm'),
  ('role', 'Researcher', 'researcher'),
  ('role', 'Operator', 'operator'),
  ('role', 'Student', 'student'),
  ('domain', 'AI', 'ai'),
  ('domain', 'Healthcare', 'healthcare'),
  ('domain', 'Energy', 'energy'),
  ('domain', 'Climate', 'climate'),
  ('domain', 'Fintech', 'fintech'),
  ('domain', 'Consumer', 'consumer'),
  ('domain', 'Enterprise', 'enterprise'),
  ('domain', 'Robotics', 'robotics'),
  ('domain', 'Biotech', 'biotech')
on conflict (tag_type, slug) do update
set name = excluded.name,
    is_active = true;
