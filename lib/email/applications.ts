import { Resend } from "resend";

import { env } from "@/lib/env";
import type { ApplicationInput } from "@/lib/types";

export async function sendApplicationEmail(applicationId: string, payload: ApplicationInput) {
  if (!env.RESEND_API_KEY) {
    console.warn("Skipping Resend email because RESEND_API_KEY is not configured.");
    return;
  }

  const resend = new Resend(env.RESEND_API_KEY);
  const adminUrl = `${env.APP_BASE_URL}/admin/applications?id=${applicationId}`;

  await resend.emails.send({
    from: env.RESEND_FROM_EMAIL,
    to: "hurshshah483@gmail.com",
    subject: `New UCSB Network application: ${payload.fullName}`,
    text: [
      `Applicant: ${payload.fullName}`,
      `Title: ${payload.currentTitle}${payload.companyOrOrg ? ` @ ${payload.companyOrOrg}` : ""}`,
      `UCSB affiliation: ${payload.ucsbAffiliationType} - ${payload.ucsbAffiliationDetail}`,
      `Bio: ${payload.bio}`,
      `Why join: ${payload.whyJoin}`,
      `Admin review: ${adminUrl}`
    ].join("\n\n")
  });
}
