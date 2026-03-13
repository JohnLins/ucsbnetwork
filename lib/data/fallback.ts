import type { MemberCard, Tag, TagType } from "@/lib/types";
import { defaultDomainOptions, defaultRoleOptions } from "@/lib/constants/options";
import { slugify } from "@/lib/utils/slug";

function buildTags(values: readonly string[], tagType: TagType): Tag[] {
  return values.map((value, index) => ({
    id: `${tagType}-${index}`,
    name: value,
    slug: slugify(value),
    tagType,
    isActive: true
  }));
}

export const fallbackTags: Tag[] = [
  ...buildTags(defaultRoleOptions, "role"),
  ...buildTags(defaultDomainOptions, "domain"),
  {
    id: "keyword-0",
    name: "community",
    slug: "community",
    tagType: "keyword",
    isActive: true
  },
  {
    id: "keyword-1",
    name: "operator",
    slug: "operator",
    tagType: "keyword",
    isActive: true
  }
];

export const fallbackMembers: MemberCard[] = [
  {
    id: "preview-1",
    slug: "ava-chen",
    fullName: "Ava Chen",
    firstName: "Ava",
    lastName: "Chen",
    headline: "Founder building applied AI tooling for clinical operations",
    companyOrOrg: "North Hall Labs",
    location: "San Francisco, CA",
    bio: "UCSB alum focused on turning research-grade models into reliable workflows for healthcare teams and technical operators.",
    websiteUrl: "https://example.com",
    isPublished: true,
    memberType: "partner",
    links: [
      {
        linkType: "website",
        label: "Site",
        url: "https://example.com",
        sortOrder: 0
      },
      {
        linkType: "linkedin",
        label: "LinkedIn",
        url: "https://linkedin.com",
        sortOrder: 1
      }
    ],
    roles: [fallbackTags.find((tag) => tag.slug === "founder")!],
    domains: [fallbackTags.find((tag) => tag.slug === "healthcare")!],
    keywords: [fallbackTags.find((tag) => tag.slug === "community")!]
  },
  {
    id: "preview-2",
    slug: "miles-ortiz",
    fullName: "Miles Ortiz",
    firstName: "Miles",
    lastName: "Ortiz",
    headline: "Quant engineer investing in energy systems and infrastructure",
    companyOrOrg: "Pacific Array",
    location: "New York, NY",
    bio: "Builder-investor working across energy markets, quant systems, and founder support with a bias toward deep technical teams.",
    websiteUrl: "https://example.org",
    isPublished: true,
    memberType: "partner",
    links: [
      {
        linkType: "website",
        label: "Site",
        url: "https://example.org",
        sortOrder: 0
      },
      {
        linkType: "x",
        label: "X",
        url: "https://x.com",
        sortOrder: 1
      }
    ],
    roles: [fallbackTags.find((tag) => tag.slug === "vc")!, fallbackTags.find((tag) => tag.slug === "quant")!],
    domains: [fallbackTags.find((tag) => tag.slug === "energy")!],
    keywords: [fallbackTags.find((tag) => tag.slug === "operator")!]
  }
];
