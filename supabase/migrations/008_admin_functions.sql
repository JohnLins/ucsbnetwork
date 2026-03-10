create or replace function public.ensure_tag(tag_type_input text, slug_input text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  existing_id uuid;
  normalized_slug text;
  normalized_name text;
begin
  normalized_slug := lower(regexp_replace(slug_input, '[^a-z0-9]+', '-', 'g'));
  normalized_slug := regexp_replace(normalized_slug, '(^-+|-+$)', '', 'g');
  normalized_name := initcap(replace(normalized_slug, '-', ' '));

  select id into existing_id
  from public.tags
  where tag_type = tag_type_input
    and slug = normalized_slug;

  if existing_id is not null then
    return existing_id;
  end if;

  insert into public.tags (tag_type, slug, name, is_active)
  values (tag_type_input, normalized_slug, normalized_name, true)
  returning id into existing_id;

  return existing_id;
end;
$$;

create or replace function public.approve_application(application_id uuid, reviewer_email citext, member_payload jsonb)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  application_row public.applications%rowtype;
  new_member_id uuid;
  member_slug text;
  next_slug text;
  role_slug text;
  domain_slug text;
  keyword_slug text;
  link_record jsonb;
begin
  select * into application_row
  from public.applications
  where id = application_id
  for update;

  if not found then
    raise exception 'Application not found';
  end if;

  member_slug := lower(regexp_replace(coalesce(member_payload ->> 'fullName', application_row.full_name), '[^a-z0-9]+', '-', 'g'));
  member_slug := regexp_replace(member_slug, '(^-+|-+$)', '', 'g');
  next_slug := member_slug;

  if exists (select 1 from public.members where slug = next_slug) then
    next_slug := member_slug || '-' || left(application_id::text, 8);
  end if;

  insert into public.members (
    slug,
    full_name,
    first_name,
    last_name,
    headline,
    company_or_org,
    location,
    bio,
    website_url,
    is_published,
    sort_name,
    approved_application_id,
    published_at
  )
  values (
    next_slug,
    coalesce(member_payload ->> 'fullName', application_row.full_name),
    split_part(coalesce(member_payload ->> 'fullName', application_row.full_name), ' ', 1),
    nullif(regexp_replace(coalesce(member_payload ->> 'fullName', application_row.full_name), '^.*\s', ''), ''),
    nullif(member_payload ->> 'headline', ''),
    nullif(member_payload ->> 'companyOrOrg', ''),
    nullif(member_payload ->> 'location', ''),
    coalesce(member_payload ->> 'bio', application_row.bio),
    nullif(member_payload ->> 'websiteUrl', ''),
    true,
    lower(coalesce(member_payload ->> 'fullName', application_row.full_name)),
    application_id,
    now()
  )
  returning id into new_member_id;

  if jsonb_typeof(member_payload -> 'links') = 'array' then
    for link_record in select * from jsonb_array_elements(member_payload -> 'links')
    loop
      insert into public.member_links (member_id, link_type, label, url, sort_order)
      values (
        new_member_id,
        coalesce(link_record ->> 'linkType', 'other'),
        nullif(link_record ->> 'label', ''),
        link_record ->> 'url',
        coalesce((link_record ->> 'sortOrder')::int, 0)
      );
    end loop;
  end if;

  if jsonb_typeof(member_payload -> 'roles') = 'array' then
    for role_slug in select jsonb_array_elements_text(member_payload -> 'roles')
    loop
      insert into public.member_tags (member_id, tag_id)
      values (new_member_id, public.ensure_tag('role', role_slug))
      on conflict do nothing;
    end loop;
  end if;

  if jsonb_typeof(member_payload -> 'domains') = 'array' then
    for domain_slug in select jsonb_array_elements_text(member_payload -> 'domains')
    loop
      insert into public.member_tags (member_id, tag_id)
      values (new_member_id, public.ensure_tag('domain', domain_slug))
      on conflict do nothing;
    end loop;
  end if;

  if jsonb_typeof(member_payload -> 'keywords') = 'array' then
    for keyword_slug in select jsonb_array_elements_text(member_payload -> 'keywords')
    loop
      insert into public.member_tags (member_id, tag_id)
      values (new_member_id, public.ensure_tag('keyword', keyword_slug))
      on conflict do nothing;
    end loop;
  end if;

  update public.applications
  set
    status = 'approved',
    review_notes = nullif(member_payload ->> 'reviewNotes', ''),
    reviewed_by_admin_email = reviewer_email,
    approved_member_id = new_member_id,
    reviewed_at = now()
  where id = application_id;

  return new_member_id;
end;
$$;

create or replace function public.reject_application(application_id uuid, reviewer_email citext, review_notes text default null)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.applications
  set
    status = 'rejected',
    review_notes = review_notes,
    reviewed_by_admin_email = reviewer_email,
    reviewed_at = now()
  where id = application_id;
end;
$$;
