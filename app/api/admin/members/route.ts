import { NextResponse } from "next/server";

import { getAdminSession } from "@/lib/auth";
import { syncMemberRecord } from "@/lib/data/mutations";
import { sendMemberWelcomeEmail } from "@/lib/email/member-welcome";
import { memberUpsertSchema } from "@/lib/schema";
import { getSupabaseServiceClient } from "@/lib/supabase/service";
import { generatePassword, hashPassword } from "@/lib/utils/password";

export async function POST(request: Request) {
  const session = await getAdminSession();

  if (!session.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const warnings: string[] = [];

  try {
    const body = await request.json();
    const payload = memberUpsertSchema.parse(body);
    const isNew = !payload.id;
    const memberId = await syncMemberRecord(payload);

    // For new members, create credentials and send welcome email
    if (isNew && payload.email) {
      const supabase = getSupabaseServiceClient();

      if (supabase) {
        const plainPassword = generatePassword(16);
        const passwordHash = await hashPassword(plainPassword);

        const { error: credError } = await supabase.from("member_credentials").insert({
          member_id: memberId,
          email: payload.email.toLowerCase(),
          password_hash: passwordHash
        });

        if (credError) {
          console.error("Failed to create member credentials:", credError);
          warnings.push(`Credentials not saved: ${credError.message}`);
        } else {
          // Send welcome email
          try {
            await sendMemberWelcomeEmail(
              payload.email,
              payload.fullName,
              plainPassword,
              payload.memberType ?? "member"
            );
          } catch (emailError) {
            const msg = emailError instanceof Error ? emailError.message : String(emailError);
            console.error("Failed to send welcome email:", msg);
            warnings.push(`Welcome email failed: ${msg}`);
          }
        }
      }
    }

    return NextResponse.json({
      ok: true,
      memberId,
      ...(warnings.length > 0 ? { warnings } : {})
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to save member." },
      { status: 400 }
    );
  }
}
