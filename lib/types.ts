export type TagType = "role" | "domain" | "keyword";
export type LinkType = "website" | "linkedin" | "github" | "x" | "other";
export type ApplicationStatus = "pending" | "approved" | "rejected";
export type MemberType = "partner" | "member" | "alumni_advisor" | "alumni_network";

export type Tag = {
  id: string;
  name: string;
  slug: string;
  tagType: TagType;
  isActive: boolean;
};

export type LinkRecord = {
  id?: string;
  linkType: LinkType;
  label: string | null;
  url: string;
  sortOrder: number;
};

export type MemberCard = {
  id: string;
  slug: string;
  fullName: string;
  firstName: string | null;
  lastName: string | null;
  headline: string | null;
  companyOrOrg: string | null;
  location: string | null;
  bio: string;
  websiteUrl: string | null;
  isPublished: boolean;
  memberType: MemberType;
  links: LinkRecord[];
  roles: Tag[];
  domains: Tag[];
  keywords: Tag[];
};

export type AdminMember = MemberCard & {
  email: string | null;
};

export type DirectoryFilters = {
  q: string;
  roles: string[];
  domains: string[];
  keywords: string[];
};

export type ApplicationLinkInput = {
  linkType: LinkType;
  label?: string;
  url: string;
};

export type ApplicationInput = {
  fullName: string;
  email: string;
  phone?: string;
  ucsbAffiliationType: string;
  ucsbAffiliationDetail: string;
  graduationYear?: string | null;
  currentTitle: string;
  companyOrOrg?: string;
  location?: string;
  websiteUrl?: string;
  bio: string;
  roles: string[];
  customRoles?: string[];
  domains: string[];
  customDomains?: string[];
  keywords: string[];
  linkedinUrl?: string;
  xUrl?: string;
  githubUrl?: string;
  additionalLinks?: ApplicationLinkInput[];
  whatYouCanHelpWith?: string;
  whatYouAreLookingFor?: string;
  whyJoin: string;
  referredBy?: string;
  resumeUrl?: string;
  consentToPublishSelectedProfileFields: boolean;
  formStartedAt: number;
  honeypot?: string;
};

export type ApplicationRecord = {
  id: string;
  status: ApplicationStatus;
  fullName: string;
  email: string;
  phone: string | null;
  ucsbAffiliationType: string;
  ucsbAffiliationDetail: string;
  graduationYear: string | null;
  currentTitle: string;
  companyOrOrg: string | null;
  location: string | null;
  websiteUrl: string | null;
  bio: string;
  whatYouCanHelpWith: string | null;
  whatYouAreLookingFor: string | null;
  whyJoin: string;
  referredBy: string | null;
  resumeUrl: string | null;
  resumeSignedUrl: string | null;
  consentToPublish: boolean;
  reviewNotes: string | null;
  reviewedByAdminEmail: string | null;
  approvedMemberId: string | null;
  submittedAt: string;
  reviewedAt: string | null;
  links: LinkRecord[];
  roles: Tag[];
  domains: Tag[];
  keywords: Tag[];
};

export type AdminApplicationReviewPayload = {
  applicationId: string;
  decision: "approve" | "reject";
  reviewNotes?: string;
  memberDraft: {
    fullName: string;
    headline: string;
    companyOrOrg?: string;
    location?: string;
    bio: string;
    websiteUrl?: string;
    memberType: MemberType;
    links: Array<{ linkType: LinkType; label?: string; url: string }>;
    roles: string[];
    domains: string[];
    keywords: string[];
  };
};

// ── Events ──

export type EventVisibility = "all" | "partners_only" | "advisors_only" | "partners_and_advisors";
export type RsvpMode = "open" | "invite_only" | "closed";
export type RsvpStatus = "going" | "maybe" | "not_going";

export type EventRecord = {
  id: string;
  title: string;
  description: string;
  location: string;
  eventDate: string;
  endDate: string | null;
  imageUrl: string | null;
  externalUrl: string | null;
  sponsor: string | null;
  maxCapacity: number | null;
  visibility: EventVisibility;
  rsvpMode: RsvpMode;
  rsvpOpenTo: MemberType[];
  createdAt: string;
  updatedAt: string;
};

export type EventWithRsvp = EventRecord & {
  rsvpCount: number;
  currentUserRsvp: RsvpStatus | null;
  canRsvp: boolean;
};

export type EventRsvp = {
  id: string;
  eventId: string;
  memberId: string;
  memberName: string;
  memberType: MemberType;
  status: RsvpStatus;
  invited: boolean;
  createdAt: string;
};

export type EventUpsertInput = {
  id?: string;
  title: string;
  description: string;
  location: string;
  eventDate: string;
  endDate?: string;
  imageUrl?: string;
  externalUrl?: string;
  sponsor?: string;
  maxCapacity?: number | null;
  visibility: EventVisibility;
  rsvpMode: RsvpMode;
  rsvpOpenTo: MemberType[];
};

export type MemberUpsertInput = {
  id?: string;
  email?: string;
  fullName: string;
  headline?: string;
  companyOrOrg?: string;
  location?: string;
  bio: string;
  websiteUrl?: string;
  isPublished: boolean;
  memberType: MemberType;
  links: Array<{ linkType: LinkType; label?: string; url: string }>;
  roles: string[];
  domains: string[];
  keywords: string[];
};
