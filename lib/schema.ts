import { z } from "zod";

import type { LinkType } from "@/lib/types";
import { isSafeExternalUrl } from "@/lib/utils/urls";

const linkTypeSchema = z.enum(["website", "linkedin", "github", "x", "other"] satisfies [LinkType, ...LinkType[]]);

const optionalUrlSchema = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value?.length ? value : undefined))
  .refine((value) => isSafeExternalUrl(value), "Enter a valid URL");

export const applicationSchema = z.object({
  fullName: z.string().trim().min(2),
  email: z.string().trim().email(),
  phone: z.string().trim().optional(),
  ucsbAffiliationType: z.string().trim().min(2),
  ucsbAffiliationDetail: z.string().trim().optional(),
  graduationYear: z.string().trim().nullable().optional(),
  currentTitle: z.string().trim().optional(),
  companyOrOrg: z.string().trim().optional(),
  location: z.string().trim().optional(),
  websiteUrl: optionalUrlSchema,
  bio: z.string().trim(),
  roles: z.array(z.string().trim().min(1)).optional().default([]),
  customRoles: z.array(z.string().trim().min(1)).optional(),
  domains: z.array(z.string().trim().min(1)).optional().default([]),
  customDomains: z.array(z.string().trim().min(1)).optional(),
  keywords: z.array(z.string().trim().min(1)).optional().default([]),
  linkedinUrl: optionalUrlSchema,
  xUrl: optionalUrlSchema,
  githubUrl: optionalUrlSchema,
  additionalLinks: z
    .array(
      z.object({
        linkType: linkTypeSchema,
        label: z.string().trim().optional(),
        url: z.string().trim().min(1).refine(isSafeExternalUrl, "Enter a valid URL")
      })
    )
    .optional(),
  whatYouCanHelpWith: z.string().trim().optional(),
  whatYouAreLookingFor: z.string().trim().optional(),
  whyJoin: z.string().trim().optional(),
  referredBy: z.string().trim().optional(),
  resumeUrl: z.string().trim().optional(),
  consentToPublishSelectedProfileFields: z.literal(true),
  formStartedAt: z.number().int(),
  honeypot: z.string().optional()
});

export const rejectionVariantSchema = z.enum([
  "standard",
  "hackathon",
  "next_cohort",
  "team_matching"
]);

export const adminReviewSchema = z.object({
  applicationId: z.string().uuid(),
  decision: z.enum(["approve", "reject"]),
  reviewNotes: z.string().trim().optional(),
  rejectionVariant: rejectionVariantSchema.optional(),
  applicantNote: z.string().trim().max(2000).optional(),
  memberDraft: z.object({
    fullName: z.string().trim(),
    headline: z.string().trim().optional().default(""),
    companyOrOrg: z.string().trim().optional(),
    location: z.string().trim().optional(),
    bio: z.string().trim().optional().default(""),
    websiteUrl: optionalUrlSchema,
    memberType: z.enum(["partner", "member", "alumni_advisor", "alumni_network"]).default("partner"),
    cohort: z.number().int().min(0).nullable().optional(),
    links: z.array(
      z.object({
        linkType: linkTypeSchema,
        label: z.string().trim().optional(),
        url: z.string().trim().min(1).refine(isSafeExternalUrl, "Enter a valid URL")
      })
    ),
    roles: z.array(z.string().trim().min(1)),
    domains: z.array(z.string().trim().min(1)),
    keywords: z.array(z.string().trim().min(1))
  })
});

export const hackathonSignupSchema = z
  .object({
    name: z.string().trim().min(2).max(120),
    email: z.string().trim().email().max(200),
    school: z.string().trim().max(120).optional(),
    pitch: z.string().trim().min(10).max(2000),
    link: optionalUrlSchema,
    teamStatus: z.enum(["solo", "team"]),
    teammates: z
      .string()
      .trim()
      .max(1000)
      .optional()
      .transform((value) => (value?.length ? value : undefined)),
    formStartedAt: z.number().int(),
    honeypot: z.string().optional()
  })
  .superRefine((value, ctx) => {
    if (value.teamStatus === "team" && !value.teammates) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["teammates"],
        message: "List your teammates or switch to solo."
      });
    }
  });

export const hackathonAdminReviewSchema = z.object({
  signupId: z.string().uuid(),
  decision: z.enum(["accept", "reject"]),
  reviewNotes: z.string().trim().max(2000).optional(),
  personalNote: z.string().trim().max(2000).optional()
});

export const officeHoursSignupSchema = z.object({
  names: z.string().trim().min(2).max(500),
  phone: z.string().trim().min(10).max(40),
  relevantLinks: z.string().trim().max(4000).optional(),
  project: z.string().trim().min(20).max(8000),
  formStartedAt: z.number().int(),
  honeypot: z.string().optional()
});

export const memberUpsertSchema = z.object({
  id: z.string().uuid().optional(),
  email: z
    .string()
    .trim()
    .transform((v) => (v === "" ? undefined : v))
    .pipe(z.string().email().optional()),
  fullName: z.string().trim(),
  headline: z.string().trim().optional().default(""),
  companyOrOrg: z.string().trim().optional(),
  location: z.string().trim().optional(),
  bio: z.string().trim().optional().default(""),
  websiteUrl: optionalUrlSchema,
  isPublished: z.boolean(),
  memberType: z.enum(["partner", "member", "alumni_advisor", "alumni_network"]).default("partner"),
  cohort: z.number().int().min(0).nullable().optional(),
  links: z.array(
    z.object({
      linkType: linkTypeSchema,
      label: z.string().trim().optional(),
      url: z.string().trim().min(1).refine(isSafeExternalUrl, "Enter a valid URL")
    })
  ),
  roles: z.array(z.string().trim().min(1)),
  domains: z.array(z.string().trim().min(1)),
  keywords: z.array(z.string().trim().min(1))
});
