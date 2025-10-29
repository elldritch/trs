import type { Route } from "./+types/audit-application";

export default function AuditApplication({ params }: Route.ComponentProps) {
  const { ticketId } = params;
  console.log(ticketId);
  return <div>AuditApplication</div>;
}
