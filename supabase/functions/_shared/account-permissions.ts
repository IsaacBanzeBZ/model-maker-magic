export type EduLedgerRole = "super_admin" | "university_admin" | "student";

export interface AccountScope {
  role: EduLedgerRole;
  universityId: string | null;
}

export function canManageAccount(actor: AccountScope, target: AccountScope): boolean {
  if (actor.role === "super_admin") {
    return target.role === "university_admin" || target.role === "student";
  }

  return (
    actor.role === "university_admin" &&
    target.role === "student" &&
    actor.universityId !== null &&
    actor.universityId === target.universityId
  );
}