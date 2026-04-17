import { Resend } from "resend";

import { env } from "@/lib/env";

export type RejectionVariant = "standard" | "hackathon" | "next_cohort";

type SendRejectionEmailArgs = {
  applicantEmail: string;
  applicantName: string;
  variant: RejectionVariant;
  personalNote?: string;
};

function getFirstName(fullName: string) {
  const first = fullName.trim().split(/\s+/)[0];
  return first || fullName;
}

function getCopy(variant: RejectionVariant, firstName: string) {
  const hackathonUrl = `${env.APP_BASE_URL}/hackathon#signup`;
  const applyUrl = `${env.APP_BASE_URL}/apply`;

  switch (variant) {
    case "hackathon":
      return {
        subject: "ucsb.network: your application",
        body: [
          `Hi ${firstName},`,
          "",
          "Thanks for applying to the ucsb.network cohort. We're not able to offer you a spot this time.",
          "",
          "That said, you can clearly build, and the hackathon is the right room for you. A weekend in person with the cohort and a handful of outside UCSB builders we pick by hand. $1,000 in credits for the winner; $250 in credits for everyone who ships.",
          "",
          `Sign up here: ${hackathonUrl}`
        ]
      };
    case "next_cohort":
      return {
        subject: "ucsb.network: your application",
        body: [
          `Hi ${firstName},`,
          "",
          "Thanks for applying to the ucsb.network cohort. This was a hard call; you were near the top of the pile.",
          "",
          "We're only taking six startups in the first cohort, so we had to draw a tight line. Please apply to the next cycle. You're exactly the kind of builder we want around.",
          "",
          `Applications: ${applyUrl}`
        ]
      };
    case "standard":
    default:
      return {
        subject: "ucsb.network: your application",
        body: [
          `Hi ${firstName},`,
          "",
          "Thanks for applying to the ucsb.network cohort. We read every application carefully, and we're not able to offer you a spot this time.",
          "",
          "Cohort one is only six startups, so we had to be selective. This isn't a verdict on you or what you're building; keep shipping, and keep us posted."
        ]
      };
  }
}

export async function sendRejectionEmail({
  applicantEmail,
  applicantName,
  variant,
  personalNote
}: SendRejectionEmailArgs) {
  if (!env.RESEND_API_KEY) {
    console.warn("Skipping rejection email because RESEND_API_KEY is not configured.");
    return;
  }

  const resend = new Resend(env.RESEND_API_KEY);
  const firstName = getFirstName(applicantName);
  const copy = getCopy(variant, firstName);

  const note = personalNote?.trim();
  const bodyLines = [...copy.body];
  if (note) {
    bodyLines.push("", note);
  }
  bodyLines.push("", "Hursh", "ucsb.network");

  const text = bodyLines.join("\n");

  const { error } = await resend.emails.send({
    from: env.RESEND_FROM_EMAIL,
    to: applicantEmail,
    replyTo: "hursh@ucsb.network",
    subject: copy.subject,
    text
  });

  if (error) {
    throw new Error(`Resend API error: ${error.message}`);
  }

  await resend.emails.send({
    from: env.RESEND_FROM_EMAIL,
    to: "hurshshah483@gmail.com",
    subject: `[Admin] Rejection sent to ${applicantName} (${variant})`,
    text: [
      `Applicant: ${applicantName} <${applicantEmail}>`,
      `Variant: ${variant}`,
      note ? `Personal note: ${note}` : "Personal note: (none)",
      "",
      "---",
      "",
      text
    ].join("\n")
  });
}
