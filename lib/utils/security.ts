import { createHash } from "node:crypto";

import { env } from "@/lib/env";

export function hashSensitiveValue(value: string) {
  return createHash("sha256")
    .update(`${env.RATE_LIMIT_SALT ?? "local-dev-salt"}:${value}`)
    .digest("hex");
}

export function isLikelyBotSubmission(formStartedAt: number, honeypot?: string) {
  if (honeypot && honeypot.trim().length > 0) {
    return true;
  }

  return Date.now() - formStartedAt < 3000;
}
