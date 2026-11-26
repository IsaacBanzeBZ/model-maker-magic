import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SuperAdminSidebar } from "@/components/SuperAdminSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { RoleGate } from "@/components/RoleGate";

export default function SuperAdminLayout() {
  return (
    <RoleGate role="super_admin">
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <SuperAdminSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center border-b border-border bg-background px-4 gap-3">
            <SidebarTrigger />
            <span className="text-sm font-medium text-secondary flex-1">Super Administration</span>
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
