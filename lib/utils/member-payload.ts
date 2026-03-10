import { slugify } from "@/lib/utils/slug";
import { normalizeOptionalUrl } from "@/lib/utils/urls";

export function splitName(fullName: string) {
  const parts = fullName.trim().split(/\s+/);

  if (parts.length === 1) {
    return {
      firstName: parts[0],
      lastName: null
    };
  }

  return {
    firstName: parts.slice(0, -1).join(" "),
    lastName: parts.at(-1) ?? null
  };
}

export function buildMemberPayload(fullName: string, input: Record<string, unknown>) {
  const { firstName, lastName } = splitName(fullName);
  const sortName = `${lastName ?? ""} ${firstName}`.trim().toLowerCase();

  return {
    slug: slugify(fullName),
    first_name: firstName,
    last_name: lastName,
    sort_name: sortName,
    full_name: fullName,
    headline: String(input.headline ?? ""),
    company_or_org: input.companyOrOrg ? String(input.companyOrOrg) : null,
    location: input.location ? String(input.location) : null,
    bio: String(input.bio ?? ""),
    website_url: normalizeOptionalUrl(input.websiteUrl ? String(input.websiteUrl) : null),
    is_published: Boolean(input.isPublished ?? true),
    published_at: Boolean(input.isPublished ?? true) ? new Date().toISOString() : null,
    archived_at: null
  };
}
