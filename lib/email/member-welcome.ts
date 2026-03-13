import { Resend } from "resend";

import { env } from "@/lib/env";
import type { MemberType } from "@/lib/types";

export async function sendMemberWelcomeEmail(
  memberEmail: string,
  memberName: string,
  password: string,
  memberType: MemberType = "partner"
) {
  if (!env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not configured — cannot send welcome email.");
  }

  const resend = new Resend(env.RESEND_API_KEY);
  const loginUrl = `${env.APP_BASE_URL}/members/login`;

  const wording = getEmailWording(memberType);

  const subject = wording.subject;
  const greeting = wording.greeting;
  const directoryNote = wording.directoryNote;

  const { error } = await resend.emails.send({
    from: env.RESEND_FROM_EMAIL,
    to: memberEmail,
    subject,
    text: [
      `Hey ${memberName},`,
      "",
      greeting,
      "",
      "Here are your login credentials:",
      "",
      `Email: ${memberEmail}`,
      `Password: ${password}`,
      "",
      `Login here: ${loginUrl}`,
      "",
      directoryNote,
      "",
      "— ucsb.network"
    ].join("\n")
  });

  if (error) {
    throw new Error(`Resend API error: ${error.message}`);
  }

  // Also send a copy to admin so they know credentials were sent
  await resend.emails.send({
    from: env.RESEND_FROM_EMAIL,
    to: "hurshshah483@gmail.com",
    subject: `[Admin] Credentials sent to ${memberName} (${memberType})`,
    text: [
      `${memberType}: ${memberName}`,
      `Email: ${memberEmail}`,
      `Password: ${password}`,
      "",
      `Login URL: ${loginUrl}`,
      "",
      "This email was sent to you as a record of the credentials."
    ].join("\n")
  });
}

function getEmailWording(memberType: MemberType) {
  switch (memberType) {
    case "partner":
      return {
        subject: "Welcome to ucsb.network — Founding Partner",
        greeting: "You've been accepted into ucsb.network as a founding partner.",
        directoryNote:
          "Once logged in you can view the full network directory — partners, members, and alumni."
      };
    case "alumni_advisor":
      return {
        subject: "Welcome to ucsb.network — Advisor",
        greeting: "You've been added as an advisor to ucsb.network.",
        directoryNote:
          "Once logged in you can view the full network directory — members, partners, and fellow alumni."
      };
    case "alumni_network":
      return {
        subject: "Welcome to ucsb.network",
        greeting:
          "You've been added to the ucsb.network alumni community. We're excited to have you in the network.",
        directoryNote:
          "Once logged in you can view the full network directory — members, partners, and fellow alumni."
      };
    case "member":
    default:
      return {
        subject: "Welcome to ucsb.network",
        greeting: "You've been accepted into ucsb.network.",
        directoryNote:
          "Once logged in you can view the full member directory and reach out to other members."
      };
  }
}
