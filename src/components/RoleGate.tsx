import { useEffect, useState, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { LoaderCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { manageAccount } from "@/lib/account-management";
import { ForcePasswordChangeDialog } from "@/components/ForcePasswordChangeDialog";

export type EduLedgerRole = "super_admin" | "university_admin" | "student";

interface RoleGateProps {
  role: EduLedgerRole;
  children: ReactNode;
}

const loginPath: Record<EduLedgerRole, string> = {
  super_admin: "/login/super-admin",
  university_admin: "/login/admin",
  student: "/login/student",
};

export function RoleGate({ role, children }: RoleGateProps) {
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const [mustChangePassword, setMustChangePassword] = useState(false);

  useEffect(() => {
    let active = true;

    const validateSession = async () => {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        if (active) {
          setAllowed(false);
          setChecking(false);
        }
        return;
      }

      const [{ data: profile }, { data: roles }] = await Promise.all([
        supabase.from("profiles").select("status, must_change_password").eq("id", user.id).maybeSingle(),
        supabase.from("user_roles").select("role").eq("user_id", user.id),
      ]);
      const hasRequiredRole = roles?.some((item) => item.role === role) ?? false;
      if (!profile || profile.status !== "active" || !hasRequiredRole) {
        await supabase.auth.signOut();
        if (active) {
          setAllowed(false);
          setChecking(false);
        }
        return;
      }

      try {
        await manageAccount({ action: "sync-my-email" });
      } catch {
        // Email synchronization is secondary; authorization comes from the validated role and profile.
      }
      if (active) {
        setMustChangePassword(profile.must_change_password);
        setAllowed(true);
        setChecking(false);
      }
    };

    void validateSession();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        if (active) {
          setAllowed(false);
          setChecking(false);
        }
        return;
      }
      window.setTimeout(() => void validateSession(), 0);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [role]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground" aria-label="Vérification du compte">
        <LoaderCircle className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!allowed) return <Navigate to={loginPath[role]} replace />;

  return (
    <>
      {children}
      <ForcePasswordChangeDialog open={mustChangePassword} onComplete={() => setMustChangePassword(false)} />
    </>
  );
}