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
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().email(),
  phone: z.string().trim().max(40).optional(),
  ucsbAffiliationType: z.string().trim().min(2).max(80),
  ucsbAffiliationDetail: z.string().trim().min(2).max(160),
  graduationYear: z.number().int().min(1950).max(2100).nullable().optional(),
  currentTitle: z.string().trim().min(2).max(120),
  companyOrOrg: z.string().trim().max(120).optional(),
  location: z.string().trim().max(120).optional(),
  websiteUrl: optionalUrlSchema,
  bio: z.string().trim().min(10).max(1200),
  roles: z.array(z.string().trim().min(1).max(60)).max(8),
  customRoles: z.array(z.string().trim().min(1).max(60)).max(5).optional(),
  domains: z.array(z.string().trim().min(1).max(60)).max(8),
  customDomains: z.array(z.string().trim().min(1).max(60)).max(5).optional(),
  keywords: z.array(z.string().trim().min(1).max(60)).max(16),
  linkedinUrl: optionalUrlSchema,
  xUrl: optionalUrlSchema,
  githubUrl: optionalUrlSchema,
  additionalLinks: z
    .array(
      z.object({
        linkType: linkTypeSchema,
        label: z.string().trim().max(60).optional(),
        url: z.string().trim().min(1).refine(isSafeExternalUrl, "Enter a valid URL")
      })
    )
    .max(8)
    .optional(),
  whatYouCanHelpWith: z.string().trim().max(500).optional(),
  whatYouAreLookingFor: z.string().trim().max(500).optional(),
  whyJoin: z.string().trim().min(20).max(700),
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
