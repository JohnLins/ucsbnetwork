import { slugify } from "@/lib/utils/slug";
import { buildMemberPayload } from "@/lib/utils/member-payload";
import { normalizeOptionalUrl } from "@/lib/utils/urls";
import type { ApplicationInput, LinkType, MemberUpsertInput } from "@/lib/types";
import { getSupabaseServiceClient } from "@/lib/supabase/service";

type TagType = "role" | "domain" | "keyword";

function titleCaseFromSlug(slug: string) {
  return slug
    .split("-")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

export async function resolveTagIds(tagType: TagType, values: string[]) {
  const supabase = getSupabaseServiceClient();

  if (!supabase || values.length === 0) {
    return [];
  }

  const normalized = Array.from(
    new Map(
      values
        .map((value) => value.trim())
        .filter(Boolean)
        .map((value) => {
          const slug = slugify(value);
          return [
            slug,
            {
              slug,
              name: value.includes("-") || value === value.toLowerCase() ? titleCaseFromSlug(slug) : value
            }
          ] as const;
        })
    ).values()
  );

  const slugs = normalized.map((entry) => entry.slug);
  const { data: existing } = await supabase
    .from("tags")
    .select("id, slug")
    .eq("tag_type", tagType)
    .in("slug", slugs);

  const existingBySlug = new Map((existing ?? []).map((tag) => [tag.slug, tag.id]));
  const missing = normalized.filter((entry) => !existingBySlug.has(entry.slug));

  if (missing.length > 0) {
    const { data: inserted, error } = await supabase
      .from("tags")
      .insert(
        missing.map((entry) => ({
          tag_type: tagType,
          name: entry.name,
          slug: entry.slug,
          is_active: true
        }))
      )
      .select("id, slug");

    if (error) {
      throw error;
    }

    for (const tag of inserted ?? []) {
      existingBySlug.set(tag.slug, tag.id);
    }
  }

  return normalized.map((entry) => existingBySlug.get(entry.slug)).filter(Boolean) as string[];
}

export async function createApplicationRecord(payload: ApplicationInput) {
  const supabase = getSupabaseServiceClient();

  if (!supabase) {
    throw new Error("Supabase service role environment variables are not configured.");
  }

  const { data: application, error: applicationError } = await supabase
    .from("applications")
    .insert({
      status: "pending",
      full_name: payload.fullName,
      email: payload.email.toLowerCase(),
      phone: payload.phone || null,
      ucsb_affiliation_type: payload.ucsbAffiliationType,
      ucsb_affiliation_detail: payload.ucsbAffiliationDetail,
      graduation_year: payload.graduationYear ?? null,
      current_title: payload.currentTitle,
      company_or_org: payload.companyOrOrg || null,
      location: payload.location || null,
      website_url: normalizeOptionalUrl(payload.websiteUrl),
      bio: payload.bio,
      what_you_can_help_with: payload.whatYouCanHelpWith || null,
      what_you_are_looking_for: payload.whatYouAreLookingFor || null,
      why_join: payload.whyJoin,
      referred_by: payload.referredBy || null,
      consent_to_publish: payload.consentToPublishSelectedProfileFields
    })
    .select("id")
    .single();

  if (applicationError) {
    throw applicationError;
  }

  const links = [
    payload.websiteUrl
      ? {
          link_type: "website" as LinkType,
          label: "Site",
          url: normalizeOptionalUrl(payload.websiteUrl)
        }
      : null,
    payload.linkedinUrl
      ? {
          link_type: "linkedin" as LinkType,
          label: "LinkedIn",
          url: normalizeOptionalUrl(payload.linkedinUrl)
        }
      : null,
    payload.githubUrl
      ? {
          link_type: "github" as LinkType,
          label: "GitHub",
          url: normalizeOptionalUrl(payload.githubUrl)
        }
      : null,
    payload.xUrl
      ? {
          link_type: "x" as LinkType,
          label: "X",
          url: normalizeOptionalUrl(payload.xUrl)
        }
      : null,
    ...(payload.additionalLinks ?? []).map((link) => ({
      link_type: link.linkType,
      label: link.label ?? null,
      url: normalizeOptionalUrl(link.url)
    }))
  ].filter(Boolean);

  if (links.length > 0) {
    const { error } = await supabase.from("application_links").insert(
      links.map((link, index) => ({
        application_id: application.id,
        link_type: link!.link_type,
        label: link!.label,
        url: link!.url,
        sort_order: index
      }))
    );

    if (error) {
      throw error;
    }
  }

  const [roleIds, domainIds, keywordIds] = await Promise.all([
    resolveTagIds("role", [...payload.roles, ...(payload.customRoles ?? [])]),
    resolveTagIds("domain", [...payload.domains, ...(payload.customDomains ?? [])]),
    resolveTagIds("keyword", payload.keywords)
  ]);

  const tagRows = [...roleIds, ...domainIds, ...keywordIds].map((tagId) => ({
    application_id: application.id,
    tag_id: tagId
  }));

  if (tagRows.length > 0) {
    const { error } = await supabase.from("application_tags").insert(tagRows);

    if (error) {
      throw error;
    }
  }

  return application.id as string;
}

export async function syncMemberRecord(payload: MemberUpsertInput) {
  const supabase = getSupabaseServiceClient();

  if (!supabase) {
    throw new Error("Supabase service role environment variables are not configured.");
  }

  const memberPayload = buildMemberPayload(payload.fullName, {
    ...payload,
    isPublished: payload.isPublished
  });

  const { data: member, error: memberError } = await supabase
    .from("members")
    .upsert(
      {
        id: payload.id,
        ...memberPayload
      },
      {
        onConflict: "id"
      }
    )
    .select("id")
    .single();

  if (memberError) {
    throw memberError;
  }

  await syncMemberLinks(member.id as string, payload.links);
  await syncMemberTags(member.id as string, payload);

  return member.id as string;
}

export async function syncMemberLinks(
  memberId: string,
  links: Array<{ linkType: LinkType; label?: string; url: string }>
) {
  const supabase = getSupabaseServiceClient();

  if (!supabase) {
    throw new Error("Supabase service role environment variables are not configured.");
  }

  await supabase.from("member_links").delete().eq("member_id", memberId);

  const normalizedLinks = [
    ...links.filter((link) => link.url.trim().length > 0),
    ...(links.some((link) => link.linkType === "website") ? [] : [])
  ];

  if (normalizedLinks.length === 0) {
    return;
  }

  const { error } = await supabase.from("member_links").insert(
    normalizedLinks.map((link, index) => ({
      member_id: memberId,
      link_type: link.linkType,
      label: link.label || null,
      url: normalizeOptionalUrl(link.url),
      sort_order: index
    }))
  );

  if (error) {
    throw error;
  }
}

export async function syncMemberTags(
  memberId: string,
  payload: Pick<MemberUpsertInput, "roles" | "domains" | "keywords">
) {
  const supabase = getSupabaseServiceClient();

  if (!supabase) {
    throw new Error("Supabase service role environment variables are not configured.");
  }

  await supabase.from("member_tags").delete().eq("member_id", memberId);

  const [roleIds, domainIds, keywordIds] = await Promise.all([
    resolveTagIds("role", payload.roles),
    resolveTagIds("domain", payload.domains),
    resolveTagIds("keyword", payload.keywords)
  ]);

  const nextRows = [...roleIds, ...domainIds, ...keywordIds].map((tagId) => ({
    member_id: memberId,
    tag_id: tagId
  }));

  if (nextRows.length === 0) {
    return;
  }

  const { error } = await supabase.from("member_tags").insert(nextRows);

  if (error) {
    throw error;
  }
}
