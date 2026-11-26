import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { StudentSidebar } from "@/components/StudentSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { RoleGate } from "@/components/RoleGate";

export default function StudentLayout() {
  return (
    <RoleGate role="student">
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
    </SidebarProvider>
    </RoleGate>
  );
}
