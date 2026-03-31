import { describe, expect, it } from "vitest";

import { applicationSchema } from "@/lib/schema";

describe("applicationSchema", () => {
  it("accepts a minimal application payload", () => {
    const result = applicationSchema.parse({
      fullName: "Ava Chen",
      email: "ava@example.com",
      ucsbAffiliationType: "Alumni",
      bio: "Building a health-tech startup.",
      consentToPublishSelectedProfileFields: true,
      formStartedAt: Date.now(),
    });

    expect(result.roles).toEqual([]);
    expect(result.domains).toEqual([]);
    expect(result.keywords).toEqual([]);
  });

  it("accepts a full application payload", () => {
    const result = applicationSchema.parse({
      fullName: "Ava Chen",
      email: "ava@example.com",
      phone: "",
      ucsbAffiliationType: "Alumni",
      ucsbAffiliationDetail: "Class of 2020",
      graduationYear: "2020",
      currentTitle: "Founder",
      companyOrOrg: "North Hall Labs",
      location: "San Francisco",
      websiteUrl: "https://example.com",
      bio: "A".repeat(50),
      roles: ["founder"],
      customRoles: ["angel investor"],
      domains: ["healthcare"],
      customDomains: ["clinical ops"],
      keywords: ["community", "ai"],
      linkedinUrl: "https://linkedin.com/in/example",
      xUrl: "https://x.com/example",
      githubUrl: "https://github.com/example",
      additionalLinks: [{ linkType: "other", label: "Portfolio", url: "https://portfolio.example.com" }],
      whatYouCanHelpWith: "Introductions and hiring",
      whatYouAreLookingFor: "Co-founders",
      whyJoin: "I want to contribute to the UCSB builder network.",
      consentToPublishSelectedProfileFields: true,
      formStartedAt: Date.now(),
      honeypot: ""
    });

    expect(result.roles).toEqual(["founder"]);
  });

  it("rejects invalid urls", () => {
    expect(() =>
      applicationSchema.parse({
        fullName: "Ava Chen",
        email: "ava@example.com",
        ucsbAffiliationType: "Alumni",
        bio: "B".repeat(50),
        websiteUrl: "javascript:alert(1)",
        consentToPublishSelectedProfileFields: true,
        formStartedAt: Date.now()
      })
    ).toThrowError(/valid URL/i);
  });
});
