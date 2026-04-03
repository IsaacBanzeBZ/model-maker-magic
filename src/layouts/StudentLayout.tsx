import { useState } from "react";
import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { StudentSidebar } from "@/components/StudentSidebar";
import { ForcePasswordChangeDialog } from "@/components/ForcePasswordChangeDialog";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function StudentLayout() {
  // Simulate first login detection (in production, check from backend/JWT)
  const [needsPasswordChange, setNeedsPasswordChange] = useState(() => {
    return sessionStorage.getItem("studentPasswordChanged") !== "true";
  });

  const handlePasswordChanged = () => {
    sessionStorage.setItem("studentPasswordChanged", "true");
    setNeedsPasswordChange(false);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <StudentSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center border-b border-border bg-background px-4 gap-3">
            <SidebarTrigger />
            <span className="text-sm text-muted-foreground flex-1">Espace Étudiant</span>
            <ThemeToggle />
          </header>
          <main className="flex-1 overflow-auto bg-muted/30">
            <Outlet />
          </main>
        </div>
      </div>
      <ForcePasswordChangeDialog open={needsPasswordChange} onComplete={handlePasswordChanged} />
    </SidebarProvider>
  );
}
