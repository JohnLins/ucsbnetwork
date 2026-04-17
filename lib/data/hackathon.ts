import { getSupabaseServiceClient } from "@/lib/supabase/service";

export type HackathonSignup = {
  id: string;
  name: string;
  email: string;
  school: string | null;
  pitch: string;
  link: string | null;
  createdAt: string;
};

function mapSignup(row: Record<string, unknown>): HackathonSignup {
  return {
    id: String(row.id),
    name: String(row.name ?? ""),
    email: String(row.email ?? ""),
    school: row.school ? String(row.school) : null,
    pitch: String(row.pitch ?? ""),
    link: row.link ? String(row.link) : null,
    createdAt: String(row.created_at ?? "")
  };
}

export async function getHackathonSignups(): Promise<HackathonSignup[]> {
  const supabase = getSupabaseServiceClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("hackathon_signups")
    .select("id, name, email, school, pitch, link, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getHackathonSignups failed", error);
    return [];
  }

  return ((data ?? []) as Array<Record<string, unknown>>).map(mapSignup);
}

export async function deleteHackathonSignup(id: string): Promise<void> {
  const supabase = getSupabaseServiceClient();
  if (!supabase) throw new Error("Supabase not configured");

  const { error } = await supabase.from("hackathon_signups").delete().eq("id", id);
  if (error) throw error;
}
