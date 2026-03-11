import { z } from "zod";

const serverSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  RESEND_API_KEY: z.string().min(1).optional(),
  RESEND_FROM_EMAIL: z.string().email().default("apply@ucsb.network"),
  APP_BASE_URL: z.string().url().default("https://ucsb.network"),
  RATE_LIMIT_SALT: z.string().min(8).optional(),
  ADMIN_PASSWORD: z.string().min(12).optional()
});

const parsed = serverSchema.safeParse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL,
  APP_BASE_URL: process.env.APP_BASE_URL,
  RATE_LIMIT_SALT: process.env.RATE_LIMIT_SALT,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD
});

if (!parsed.success) {
  console.warn("Environment parsing warning", parsed.error.flatten().fieldErrors);
}

export const env = parsed.success
  ? parsed.data
  : {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
      RESEND_API_KEY: process.env.RESEND_API_KEY,
      RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL ?? "apply@ucsb.network",
      APP_BASE_URL: process.env.APP_BASE_URL ?? "https://ucsb.network",
      RATE_LIMIT_SALT: process.env.RATE_LIMIT_SALT,
      ADMIN_PASSWORD: process.env.ADMIN_PASSWORD
    };

export const hasPublicSupabaseEnv =
  Boolean(env.NEXT_PUBLIC_SUPABASE_URL) && Boolean(env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export const hasServiceSupabaseEnv =
  hasPublicSupabaseEnv && Boolean(env.SUPABASE_SERVICE_ROLE_KEY);
