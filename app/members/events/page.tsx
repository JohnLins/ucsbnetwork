import { requireMember, getMemberType } from "@/lib/member-auth";
import { getMemberEvents } from "@/lib/data/events";
import { MemberShell } from "@/components/member-shell";
import { EventsView } from "@/components/events-view";

export default async function MemberEventsPage() {
  const session = await requireMember();
  const memberType = await getMemberType(session.memberId!);
  const events = await getMemberEvents(session.memberId!, memberType);

  return (
    <MemberShell memberType={memberType}>
      <EventsView events={events} memberType={memberType} />
    </MemberShell>
  );
}
