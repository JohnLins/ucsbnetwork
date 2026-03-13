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
  ucsbAffiliationDetail: z.string().trim(),
  graduationYear: z.string().trim().nullable().optional(),
  currentTitle: z.string().trim(),
  companyOrOrg: z.string().trim().optional(),
  location: z.string().trim().optional(),
  websiteUrl: optionalUrlSchema,
  bio: z.string().trim(),
  roles: z.array(z.string().trim().min(1)),
  customRoles: z.array(z.string().trim().min(1)).optional(),
  domains: z.array(z.string().trim().min(1)),
  customDomains: z.array(z.string().trim().min(1)).optional(),
  keywords: z.array(z.string().trim().min(1)),
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
  whyJoin: z.string().trim(),
  referredBy: z.string().trim().optional(),
  consentToPublishSelectedProfileFields: z.literal(true),
  formStartedAt: z.number().int(),
  honeypot: z.string().optional()
});

export const adminReviewSchema = z.object({
  applicationId: z.string().uuid(),
  decision: z.enum(["approve", "reject"]),
  reviewNotes: z.string().trim().max(1000).optional(),
  memberDraft: z.object({
    fullName: z.string().trim().min(2).max(120),
    headline: z.string().trim().min(2).max(160),
    companyOrOrg: z.string().trim().max(120).optional(),
    location: z.string().trim().max(120).optional(),
    bio: z.string().trim().min(2).max(1200),
    websiteUrl: optionalUrlSchema,
    memberType: z.enum(["member", "advisor"]).default("member"),
    links: z.array(
      z.object({
        linkType: linkTypeSchema,
        label: z.string().trim().max(60).optional(),
        url: z.string().trim().min(1).refine(isSafeExternalUrl, "Enter a valid URL")
      })
    ),
    roles: z.array(z.string().trim().min(1).max(60)).max(12),
    domains: z.array(z.string().trim().min(1).max(60)).max(12),
    keywords: z.array(z.string().trim().min(1).max(60)).max(20)
  })
});

export const memberUpsertSchema = z.object({
  id: z.string().uuid().optional(),
  fullName: z.string().trim().min(2).max(120),
  headline: z.string().trim().min(2).max(160),
  companyOrOrg: z.string().trim().max(120).optional(),
  location: z.string().trim().max(120).optional(),
  bio: z.string().trim().min(2).max(1200),
  websiteUrl: optionalUrlSchema,
  isPublished: z.boolean(),
  memberType: z.enum(["member", "advisor"]).default("member"),
  links: z.array(
    z.object({
      linkType: linkTypeSchema,
      label: z.string().trim().max(60).optional(),
      url: z.string().trim().min(1).refine(isSafeExternalUrl, "Enter a valid URL")
    })
  ),
  roles: z.array(z.string().trim().min(1).max(60)).max(12),
  domains: z.array(z.string().trim().min(1).max(60)).max(12),
  keywords: z.array(z.string().trim().min(1).max(60)).max(20)
});
