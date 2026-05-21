import { Resend } from "resend";

import { env } from "@/lib/env";

const HACKATHON_LUMA_URL = "https://luma.com/md6em7ed";
const ADMIN_COPY_EMAIL = "hurshshah483@gmail.com";
const REPLY_TO_EMAIL = "hursh@ucsb.network";

type SendHackathonAcceptanceEmailArgs = {
  applicantEmail: string;
  applicantName: string;
  teamStatus: "solo" | "team";
  teammates?: string | null;
  personalNote?: string;
};

type SendHackathonRejectionEmailArgs = {
  applicantEmail: string;
  applicantName: string;
  personalNote?: string;
};

function getFirstName(fullName: string) {
  const first = fullName.trim().split(/\s+/)[0];
  return first || fullName;
}

export async function sendHackathonAcceptanceEmail({
  applicantEmail,
  applicantName,
  teamStatus,
  teammates,
  personalNote
}: SendHackathonAcceptanceEmailArgs) {
  if (!env.RESEND_API_KEY) {
    console.warn(
      "Skipping hackathon acceptance email because RESEND_API_KEY is not configured."
    );
    return;
  }

  const resend = new Resend(env.RESEND_API_KEY);
  const firstName = getFirstName(applicantName);
  const note = personalNote?.trim();

  const teamLine =
    teamStatus === "team"
      ? "Bring your team with you — everyone you listed is in."
      : "You're in as a solo entry. Feel free to team up on the day if you find a match.";

  const bodyLines = [
    `Hi ${firstName},`,
    "",
    "You're in for the ucsb.network hackathon on Saturday, May 23rd, 2026.",
    "",
    "Details:",
    "• 9am-9pm at the Loma Pelona Center, UCSB",
    "• 12-hour build, live judging that night",
    "• $1,000 in AI credits for the winner; $100 for everyone who ships",
    "",
    teamLine,
    "",
    `Please RSVP on Luma so you get day-of updates: ${HACKATHON_LUMA_URL}`
  ];

  if (note) {
    bodyLines.push("", note);
  }

  bodyLines.push(
    "",
    "Reply to this email with any questions.",
    "",
    "Hursh",
    "ucsb.network"
  );

  const text = bodyLines.join("\n");
  const subject = "ucsb.network hackathon: you're in";

  const { error } = await resend.emails.send({
    from: env.RESEND_FROM_EMAIL,
    to: applicantEmail,
    replyTo: REPLY_TO_EMAIL,
    subject,
    text
  });

  if (error) {
    throw new Error(`Resend API error: ${error.message}`);
  }

  await resend.emails.send({
    from: env.RESEND_FROM_EMAIL,
    to: ADMIN_COPY_EMAIL,
    subject: `[Admin] Hackathon acceptance sent to ${applicantName}`,
    text: [
      `Applicant: ${applicantName} <${applicantEmail}>`,
      `Team status: ${teamStatus}`,
      teammates ? `Teammates: ${teammates}` : "Teammates: (none)",
      note ? `Personal note: ${note}` : "Personal note: (none)",
      "",
      "---",
      "",
      text
    ].join("\n")
  });
}

export async function sendHackathonRejectionEmail({
  applicantEmail,
  applicantName,
  personalNote
}: SendHackathonRejectionEmailArgs) {
  if (!env.RESEND_API_KEY) {
    console.warn(
      "Skipping hackathon rejection email because RESEND_API_KEY is not configured."
    );
    return;
  }

  const resend = new Resend(env.RESEND_API_KEY);
  const firstName = getFirstName(applicantName);
  const note = personalNote?.trim();

  const bodyLines = [
    `Hi ${firstName},`,
    "",
    "Thanks for signing up for the ucsb.network hackathon. Outside-builder spots are limited and we couldn't fit you in this time.",
    "",
    "This isn't a judgment on you or what you're building. Keep shipping, and please apply again the next time we run something."
  ];

  if (note) {
    bodyLines.push("", note);
  }

  bodyLines.push("", "Hursh", "ucsb.network");

  const text = bodyLines.join("\n");
  const subject = "ucsb.network hackathon: your signup";

  const { error } = await resend.emails.send({
    from: env.RESEND_FROM_EMAIL,
    to: applicantEmail,
    replyTo: REPLY_TO_EMAIL,
    subject,
    text
  });

  if (error) {
    throw new Error(`Resend API error: ${error.message}`);
  }

  await resend.emails.send({
    from: env.RESEND_FROM_EMAIL,
    to: ADMIN_COPY_EMAIL,
    subject: `[Admin] Hackathon rejection sent to ${applicantName}`,
    text: [
      `Applicant: ${applicantName} <${applicantEmail}>`,
      note ? `Personal note: ${note}` : "Personal note: (none)",
      "",
      "---",
      "",
      text
    ].join("\n")
  });
}
