import { Resend } from "resend";

import { env } from "@/lib/env";

export async function sendMemberWelcomeEmail(
  memberEmail: string,
  memberName: string,
  password: string
) {
  if (!env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not configured — cannot send welcome email.");
  }

  const resend = new Resend(env.RESEND_API_KEY);
  const loginUrl = `${env.APP_BASE_URL}/members/login`;

  const { error } = await resend.emails.send({
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

  if (error) {
    throw new Error(`Resend API error: ${error.message}`);
  }

  // Also send a copy to admin so they know credentials were sent
  await resend.emails.send({
    from: env.RESEND_FROM_EMAIL,
    to: "hurshshah483@gmail.com",
    subject: `[Admin] Credentials sent to ${memberName}`,
    text: [
      `Member: ${memberName}`,
      `Email: ${memberEmail}`,
      `Password: ${password}`,
      "",
      `Login URL: ${loginUrl}`,
      "",
      "This email was sent to you as a record of the credentials."
    ].join("\n")
  });
}
