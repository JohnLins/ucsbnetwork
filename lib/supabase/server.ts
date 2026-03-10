import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

import { env, hasPublicSupabaseEnv } from "@/lib/env";

export async function getSupabaseServerClient() {
  if (!hasPublicSupabaseEnv) {
    return null;
  }

  const cookieStore = await cookies();

  return createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL!,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set() {},
        remove() {}
      }
    }
  );
}
