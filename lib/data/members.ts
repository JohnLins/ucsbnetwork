import type { LinkRecord, MemberCard, Tag, TagType } from "@/lib/types";
import { getSupabaseServiceClient } from "@/lib/supabase/service";

function formatTag(row: { id: string; name: string; slug: string; tag_type: TagType; is_active: boolean }): Tag {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    tagType: row.tag_type,
    isActive: row.is_active
  };
}

function sliceTags(tags: Tag[]) {
  return {
    roles: tags.filter((tag) => tag.tagType === "role"),
    domains: tags.filter((tag) => tag.tagType === "domain"),
    keywords: tags.filter((tag) => tag.tagType === "keyword")
  };
}

export type DirectoryMember = MemberCard & {
  email: string | null;
};

/**
 * Fetch all published members with their links, tags, and email addresses.
 * Requires the service client (bypasses RLS).
 */
export async function getDirectoryMembers(): Promise<DirectoryMember[]> {
  const supabase = getSupabaseServiceClient();

  if (!supabase) {
    return [];
  }

  const [{ data: members }, { data: links }, { data: memberTags }, { data: tags }, { data: credentials }] =
    await Promise.all([
      supabase
        .from("members")
        .select("*")
        .eq("is_published", true)
        .is("archived_at", null)
        .order("sort_name", { ascending: true }),
      supabase.from("member_links").select("id, member_id, link_type, label, url, sort_order"),
      supabase.from("member_tags").select("member_id, tag_id"),
      supabase.from("tags").select("id, name, slug, tag_type, is_active"),
      supabase.from("member_credentials").select("member_id, email")
    ]);

  const formattedTags = (tags ?? []).map(formatTag);
  const emailByMemberId = new Map(
    (credentials ?? []).map((c) => [c.member_id, c.email as string])
  );

  return ((members ?? []) as Array<Record<string, unknown>>).map<DirectoryMember>((member) => {
    const relatedTagIds = new Set(
      (memberTags ?? []).filter((tag) => tag.member_id === member.id).map((tag) => tag.tag_id)
    );
    const relatedTags = formattedTags.filter((tag) => relatedTagIds.has(tag.id));
    const groupedTags = sliceTags(relatedTags);

    return {
      id: String(member.id),
      slug: String(member.slug),
      fullName: String(member.full_name),
      firstName: member.first_name ? String(member.first_name) : null,
      lastName: member.last_name ? String(member.last_name) : null,
      headline: member.headline ? String(member.headline) : null,
      companyOrOrg: member.company_or_org ? String(member.company_or_org) : null,
      location: member.location ? String(member.location) : null,
      bio: String(member.bio),
      websiteUrl: member.website_url ? String(member.website_url) : null,
      isPublished: Boolean(member.is_published),
      email: emailByMemberId.get(String(member.id)) ?? null,
      links: (links ?? [])
        .filter((link) => link.member_id === member.id)
        .map<LinkRecord>((link) => ({
          id: link.id,
          linkType: link.link_type,
          label: link.label,
          url: link.url,
          sortOrder: link.sort_order
        }))
        .sort((left, right) => left.sortOrder - right.sortOrder),
      roles: groupedTags.roles,
      domains: groupedTags.domains,
      keywords: groupedTags.keywords
    };
  });
}
