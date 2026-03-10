import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

import { env, hasPublicSupabaseEnv } from "@/lib/env";

export async function proxy(request: NextRequest) {
  if (!hasPublicSupabaseEnv) {
    return NextResponse.next();
  }

  let response = NextResponse.next({
    request
  });

  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL!,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options) {
          request.cookies.set({
            name,
            value,
            ...options
          });
          response = NextResponse.next({
            request
          });
          response.cookies.set({
            name,
            value,
            ...options
          });
        },
        remove(name: string, options) {
          request.cookies.set({
            name,
            value: "",
            ...options
          });
          response = NextResponse.next({
            request
          });
          response.cookies.set({
            name,
            value: "",
            ...options
          });
        }
      }
    }
  );

  await supabase.auth.getUser();
  return response;
}

export const config = {
  matcher: ["/admin/:path*"]
};
