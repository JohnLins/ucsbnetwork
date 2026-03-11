import { Resend } from "resend";

import { env } from "@/lib/env";

export async function sendMemberWelcomeEmail(
  memberEmail: string,
  memberName: string,
  password: string
) {
  if (!env.RESEND_API_KEY) {
    console.warn("Skipping Resend email because RESEND_API_KEY is not configured.");
    return;
  }

  const resend = new Resend(env.RESEND_API_KEY);
  const loginUrl = `${env.APP_BASE_URL}/members/login`;

  await resend.emails.send({
    from: env.RESEND_FROM_EMAIL,
    to: memberEmail,
    subject: "Welcome to ucsb.network",
    text: [
      `Hey ${memberName},`,
      "",
      "You've been accepted into ucsb.network.",
      "",
      "Here are your login credentials:",
      "",
      `Email: ${memberEmail}`,
      `Password: ${password}`,
      "",
      `Login here: ${loginUrl}`,
      "",
      "Once logged in you can view the full member directory and reach out to other members.",
      "",
      "— ucsb.network"
    ].join("\n")
  });
}
