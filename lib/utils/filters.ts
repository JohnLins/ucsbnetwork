import type { DirectoryFilters, MemberCard, Tag } from "@/lib/types";

export function parseCsvParam(value?: string | string[]) {
  const raw = Array.isArray(value) ? value.join(",") : value ?? "";

  return raw
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

export function parseDirectoryFilters(
  searchParams: Record<string, string | string[] | undefined>
): DirectoryFilters {
  return {
    q: typeof searchParams.q === "string" ? searchParams.q.trim() : "",
    roles: parseCsvParam(searchParams.roles),
    domains: parseCsvParam(searchParams.domains),
    keywords: parseCsvParam(searchParams.keywords)
  };
}

function matchesFacet(active: string[], values: Tag[]) {
  if (active.length === 0) {
    return true;
  }

  const memberSlugs = new Set(values.map((value) => value.slug));
  return active.some((entry) => memberSlugs.has(entry));
}

export function filterMembers(members: MemberCard[], filters: DirectoryFilters) {
  const query = filters.q.toLowerCase();

  return members
    .filter((member) => {
      const matchesQuery =
        !query || member.fullName.toLowerCase().includes(query);
      const matchesRoles = matchesFacet(filters.roles, member.roles);
      const matchesDomains = matchesFacet(filters.domains, member.domains);
      const matchesKeywords = matchesFacet(filters.keywords, member.keywords);

      return matchesQuery && matchesRoles && matchesDomains && matchesKeywords;
    })
    .sort((left, right) => {
      const lastNameComparison = (left.lastName ?? "").localeCompare(right.lastName ?? "");
      if (lastNameComparison !== 0) {
        return lastNameComparison;
      }

      return left.fullName.localeCompare(right.fullName);
    });
}
