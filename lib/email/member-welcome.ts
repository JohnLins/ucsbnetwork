import { Resend } from "resend";

import { env } from "@/lib/env";
import type { MemberType } from "@/lib/types";

export async function sendMemberWelcomeEmail(
  memberEmail: string,
  memberName: string,
  password: string,
  memberType: MemberType = "member"
) {
  if (!env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not configured — cannot send welcome email.");
  }

  const isAdvisor = memberType === "advisor";
  const resend = new Resend(env.RESEND_API_KEY);
  const loginUrl = `${env.APP_BASE_URL}/members/login`;

  const subject = isAdvisor
    ? "Welcome to ucsb.network — Advisor"
    : "Welcome to ucsb.network";

  const greeting = isAdvisor
    ? "You've been added as an advisor to ucsb.network."
    : "You've been accepted into ucsb.network.";

  const directoryNote = isAdvisor
    ? "Once logged in you can view the full network directory — members and fellow advisors."
    : "Once logged in you can view the full member directory and reach out to other members.";

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
      `${isAdvisor ? "Advisor" : "Member"}: ${memberName}`,
      `Email: ${memberEmail}`,
      `Password: ${password}`,
      "",
      `Login URL: ${loginUrl}`,
      "",
      "This email was sent to you as a record of the credentials."
    ].join("\n")
  });
}
