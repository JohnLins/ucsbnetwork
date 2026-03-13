import type { DirectoryFilters, LinkRecord, MemberCard, Tag, TagType } from "@/lib/types";
import { fallbackMembers, fallbackTags } from "@/lib/data/fallback";
import { filterMembers } from "@/lib/utils/filters";
import { getSupabaseServiceClient } from "@/lib/supabase/service";

type DatabaseMember = {
  id: string;
  slug: string;
  full_name: string;
  first_name: string | null;
  last_name: string | null;
  headline: string | null;
  company_or_org: string | null;
  location: string | null;
  bio: string;
  website_url: string | null;
  is_published: boolean;
};

function groupTagsByType(tags: Tag[]) {
  return {
    roles: tags.filter((tag) => tag.tagType === "role"),
    domains: tags.filter((tag) => tag.tagType === "domain"),
    keywords: tags.filter((tag) => tag.tagType === "keyword")
  };
}

function formatTag(row: { id: string; name: string; slug: string; tag_type: TagType; is_active: boolean }): Tag {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    tagType: row.tag_type,
    isActive: row.is_active
  };
}

function hydrateMembers(
  members: DatabaseMember[],
  links: Array<LinkRecord & { member_id: string }>,
  tagLinks: Array<{ member_id: string; tag_id: string }>,
  tags: Tag[]
) {
  return members.map<MemberCard>((member) => {
    const relatedLinks = links
      .filter((link) => link.member_id === member.id)
      .map((link) => ({
        id: link.id,
        linkType: link.linkType,
        label: link.label,
        url: link.url,
        sortOrder: link.sortOrder
      }))
      .sort((left, right) => left.sortOrder - right.sortOrder);
    const relatedTagIds = new Set(
      tagLinks.filter((link) => link.member_id === member.id).map((link) => link.tag_id)
    );
    const relatedTags = tags.filter((tag) => relatedTagIds.has(tag.id));
    const groupedTags = groupTagsByType(relatedTags);

    return {
      id: member.id,
      slug: member.slug,
      fullName: member.full_name,
      firstName: member.first_name,
      lastName: member.last_name,
      headline: member.headline,
      companyOrOrg: member.company_or_org,
      location: member.location,
      bio: member.bio,
      websiteUrl: member.website_url,
      isPublished: member.is_published,
      memberType: (member as Record<string, unknown>).member_type === "advisor" ? "advisor" : "member",
      links: relatedLinks,
      roles: groupedTags.roles,
      domains: groupedTags.domains,
      keywords: groupedTags.keywords
    };
  });
}

export async function getPublicTags(): Promise<Tag[]> {
  const supabase = getSupabaseServiceClient();

  if (!supabase) {
    return fallbackTags;
  }

  const { data: tags } = await supabase
    .from("tags")
    .select("id, name, slug, tag_type, is_active")
    .eq("is_active", true);

  return (tags ?? []).map(formatTag);
}

export async function getDirectoryPageData(filters: DirectoryFilters) {
  const supabase = getSupabaseServiceClient();

  if (!supabase) {
    return {
      members: filterMembers(fallbackMembers, filters),
      tags: fallbackTags,
      usingFallbackData: true
    };
  }

  const [{ data: members }, { data: memberLinks }, { data: memberTags }, { data: tags }] = await Promise.all([
    supabase
      .from("members")
      .select("id, slug, full_name, first_name, last_name, headline, company_or_org, location, bio, website_url, is_published")
      .eq("is_published", true)
      .is("archived_at", null),
    supabase
      .from("member_links")
      .select("id, member_id, link_type, label, url, sort_order"),
    supabase
      .from("member_tags")
      .select("member_id, tag_id"),
    supabase
      .from("tags")
      .select("id, name, slug, tag_type, is_active")
      .eq("is_active", true)
  ]);

  const formattedTags = (tags ?? []).map(formatTag);
  const hydratedMembers = hydrateMembers(
    (members ?? []) as DatabaseMember[],
    (memberLinks ?? []).map((link) => ({
      id: link.id,
      member_id: link.member_id,
      linkType: link.link_type,
      label: link.label,
      url: link.url,
      sortOrder: link.sort_order
    })),
    (memberTags ?? []) as Array<{ member_id: string; tag_id: string }>,
    formattedTags
  );

  return {
    members: filterMembers(hydratedMembers, filters),
    tags: formattedTags,
    usingFallbackData: false
  };
}
