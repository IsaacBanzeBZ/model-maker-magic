import { describe, expect, it } from "vitest";
import { canManageAccount } from "../../supabase/functions/_shared/account-permissions";

describe("EduLedger account management scope", () => {
  it("allows the Super Admin to manage a student from any university", () => {
    expect(
      canManageAccount(
        { role: "super_admin", universityId: null },
        { role: "student", universityId: "university-b" },
      ),
    ).toBe(true);
  });

  it("allows a university admin to manage students in their own university", () => {
    expect(
      canManageAccount(
        { role: "university_admin", universityId: "university-a" },
        { role: "student", universityId: "university-a" },
      ),
    ).toBe(true);
  });

  it("prevents a university admin from managing another university's students", () => {
    expect(
      canManageAccount(
        { role: "university_admin", universityId: "university-a" },
        { role: "student", universityId: "university-b" },
      ),
    ).toBe(false);
  });

  it("prevents university admins and students from managing admins", () => {
    expect(
      canManageAccount(
        { role: "university_admin", universityId: "university-a" },
        { role: "university_admin", universityId: "university-a" },
      ),
    ).toBe(false);
    expect(
      canManageAccount(
        { role: "student", universityId: "university-a" },
        { role: "student", universityId: "university-a" },
      ),
    ).toBe(false);
  });
});