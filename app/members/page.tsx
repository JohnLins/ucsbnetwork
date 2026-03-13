import { redirect } from "next/navigation";
import { requireMember } from "@/lib/member-auth";

export default async function MembersPage() {
  await requireMember();
  redirect("/members/events");
}
