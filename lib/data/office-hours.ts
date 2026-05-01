import { getSupabaseServiceClient } from "@/lib/supabase/service";

export type OfficeHoursSignup = {
  id: string;
  names: string;
  phone: string;
  relevantLinks: string | null;
  project: string;
  createdAt: string;
};

function mapRow(row: Record<string, unknown>): OfficeHoursSignup {
  return {
    id: String(row.id),
    names: String(row.names ?? ""),
    phone: String(row.phone ?? ""),
    relevantLinks: row.relevant_links ? String(row.relevant_links) : null,
    project: String(row.project ?? ""),
    createdAt: String(row.created_at ?? "")
  };
}

export async function getOfficeHoursSignups(): Promise<OfficeHoursSignup[]> {
  const supabase = getSupabaseServiceClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("office_hours_signups")
    .select("id, names, phone, relevant_links, project, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getOfficeHoursSignups failed", error);
    return [];
  }

  return ((data ?? []) as Array<Record<string, unknown>>).map(mapRow);
}
