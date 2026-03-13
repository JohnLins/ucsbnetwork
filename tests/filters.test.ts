import { describe, expect, it } from "vitest";

import { filterMembers, parseDirectoryFilters } from "@/lib/utils/filters";
import type { MemberCard } from "@/lib/types";

const members: MemberCard[] = [
  {
    id: "1",
    slug: "ava-chen",
    fullName: "Ava Chen",
    firstName: "Ava",
    lastName: "Chen",
    headline: "Founder",
    companyOrOrg: "North Hall Labs",
    location: "SF",
    bio: "Bio",
    websiteUrl: null,
    isPublished: true,
    memberType: "partner",
    cohort: 1,
    links: [],
    roles: [{ id: "r1", name: "Founder", slug: "founder", tagType: "role", isActive: true }],
    domains: [{ id: "d1", name: "Healthcare", slug: "healthcare", tagType: "domain", isActive: true }],
    keywords: [{ id: "k1", name: "Community", slug: "community", tagType: "keyword", isActive: true }]
  },
  {
    id: "2",
    slug: "miles-ortiz",
    fullName: "Miles Ortiz",
    firstName: "Miles",
    lastName: "Ortiz",
    headline: "Quant",
    companyOrOrg: "Pacific Array",
    location: "NYC",
    bio: "Bio",
    websiteUrl: null,
    isPublished: true,
    memberType: "partner",
    cohort: 1,
    links: [],
    roles: [{ id: "r2", name: "Quant", slug: "quant", tagType: "role", isActive: true }],
    domains: [{ id: "d2", name: "Energy", slug: "energy", tagType: "domain", isActive: true }],
    keywords: [{ id: "k2", name: "Operator", slug: "operator", tagType: "keyword", isActive: true }]
  }
];

describe("parseDirectoryFilters", () => {
  it("parses and normalizes csv params", () => {
    expect(
      parseDirectoryFilters({
        q: " Ava ",
        roles: "founder,quant",
        domains: ["healthcare", "energy"],
        keywords: undefined
      })
    ).toEqual({
      q: "Ava",
      roles: ["founder", "quant"],
      domains: ["healthcare", "energy"],
      keywords: []
    });
  });
});

describe("filterMembers", () => {
  it("matches name search", () => {
    const result = filterMembers(members, {
      q: "ava",
      roles: [],
      domains: [],
      keywords: []
    });

    expect(result).toHaveLength(1);
    expect(result[0]?.fullName).toBe("Ava Chen");
  });

  it("uses OR within a facet and AND across facets", () => {
    const result = filterMembers(members, {
      q: "",
      roles: ["founder", "quant"],
      domains: ["energy"],
      keywords: []
    });

    expect(result).toHaveLength(1);
    expect(result[0]?.fullName).toBe("Miles Ortiz");
  });
});
