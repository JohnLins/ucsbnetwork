import type { AdminMember, ApplicationRecord, LinkRecord, MemberType, Tag, TagType } from "@/lib/types";
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

export async function getAdminTags() {
  const supabase = getSupabaseServiceClient();

  if (!supabase) {
    return [];
  }

  const { data } = await supabase
    .from("tags")
    .select("id, name, slug, tag_type, is_active")
    .eq("is_active", true)
    .order("name");

  return (data ?? []).map(formatTag);
}

export async function getApplications() {
  const supabase = getSupabaseServiceClient();

  if (!supabase) {
    return [];
  }

  const [{ data: applications }, { data: links }, { data: applicationTags }, { data: tags }] = await Promise.all([
    supabase
      .from("applications")
      .select("*")
      .order("submitted_at", { ascending: false }),
    supabase
      .from("application_links")
      .select("id, application_id, link_type, label, url, sort_order"),
    supabase
      .from("application_tags")
      .select("application_id, tag_id"),
    supabase
      .from("tags")
      .select("id, name, slug, tag_type, is_active")
  ]);

  const formattedTags = (tags ?? []).map(formatTag);

  const mapped = ((applications ?? []) as Array<Record<string, unknown>>).map<ApplicationRecord>((application) => {
    const relatedTagIds = new Set(
      (applicationTags ?? [])
        .filter((tag) => tag.application_id === application.id)
        .map((tag) => tag.tag_id)
    );
    const relatedTags = formattedTags.filter((tag) => relatedTagIds.has(tag.id));
    const groupedTags = sliceTags(relatedTags);

    return {
      id: String(application.id),
      status: application.status as ApplicationRecord["status"],
      fullName: String(application.full_name),
      email: String(application.email),
      phone: application.phone ? String(application.phone) : null,
      ucsbAffiliationType: String(application.ucsb_affiliation_type),
      ucsbAffiliationDetail: String(application.ucsb_affiliation_detail),
      graduationYear: application.graduation_year ? String(application.graduation_year) : null,
      currentTitle: String(application.current_title),
      companyOrOrg: application.company_or_org ? String(application.company_or_org) : null,
      location: application.location ? String(application.location) : null,
      websiteUrl: application.website_url ? String(application.website_url) : null,
      bio: String(application.bio),
      whatYouCanHelpWith: application.what_you_can_help_with ? String(application.what_you_can_help_with) : null,
      whatYouAreLookingFor: application.what_you_are_looking_for ? String(application.what_you_are_looking_for) : null,
      whyJoin: String(application.why_join),
      referredBy: application.referred_by ? String(application.referred_by) : null,
      resumeUrl: application.resume_url ? String(application.resume_url) : null,
      resumeSignedUrl: null,
      consentToPublish: Boolean(application.consent_to_publish),
      reviewNotes: application.review_notes ? String(application.review_notes) : null,
      reviewedByAdminEmail: application.reviewed_by_admin_email ? String(application.reviewed_by_admin_email) : null,
      approvedMemberId: application.approved_member_id ? String(application.approved_member_id) : null,
      submittedAt: String(application.submitted_at),
      reviewedAt: application.reviewed_at ? String(application.reviewed_at) : null,
      links: (links ?? [])
        .filter((link) => link.application_id === application.id)
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

  // Generate signed URLs for applications that have file uploads
  const withUploads = mapped.filter((app) => app.resumeUrl);
  if (withUploads.length > 0) {
    const signedResults = await Promise.all(
      withUploads.map((app) =>
        supabase.storage
          .from("application-uploads")
          .createSignedUrl(app.resumeUrl!, 3600) // 1 hour expiry
      )
    );
    for (let i = 0; i < withUploads.length; i++) {
      const result = signedResults[i];
      if (result.data?.signedUrl) {
        withUploads[i].resumeSignedUrl = result.data.signedUrl;
      }
    }
  }

  return mapped;
}

export async function getMembers(): Promise<AdminMember[]> {
  const supabase = getSupabaseServiceClient();

  if (!supabase) {
    return [];
  }

  const [{ data: members }, { data: links }, { data: memberTags }, { data: tags }, { data: credentials }] = await Promise.all([
    supabase
      .from("members")
      .select("*")
      .order("sort_name", { ascending: true }),
    supabase
      .from("member_links")
      .select("id, member_id, link_type, label, url, sort_order"),
    supabase
      .from("member_tags")
      .select("member_id, tag_id"),
    supabase
      .from("tags")
      .select("id, name, slug, tag_type, is_active"),
    supabase
      .from("member_credentials")
      .select("member_id, email")
  ]);

  const formattedTags = (tags ?? []).map(formatTag);
  const emailByMemberId = new Map(
    (credentials ?? []).map((c) => [c.member_id, c.email as string])
  );

  return ((members ?? []) as Array<Record<string, unknown>>).map<AdminMember>((member) => {
    const relatedTagIds = new Set(
      (memberTags ?? [])
        .filter((tag) => tag.member_id === member.id)
        .map((tag) => tag.tag_id)
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
      memberType: (["partner", "member", "alumni_advisor", "alumni_network"].includes(String(member.member_type))
        ? String(member.member_type)
        : "partner") as MemberType,
      cohort: member.cohort != null ? Number(member.cohort) : null,
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
