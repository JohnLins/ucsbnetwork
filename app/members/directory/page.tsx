import { requireMember, getMemberType } from "@/lib/member-auth";
import { getDirectoryMembers } from "@/lib/data/members";
import { MemberShell } from "@/components/member-shell";
import { MemberDirectoryView } from "@/components/member-directory-view";

export default async function MemberDirectoryPage() {
  const session = await requireMember();
  const memberType = await getMemberType(session.memberId!);
  const members = await getDirectoryMembers();

  return (
    <MemberShell memberType={memberType}>
      <MemberDirectoryView members={members} />
    </MemberShell>
  );
}
