import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import AdminLogin from "./pages/AdminLogin.tsx";
import StudentLogin from "./pages/StudentLogin.tsx";
import NotFound from "./pages/NotFound.tsx";
import AdminLayout from "./layouts/AdminLayout.tsx";
import AdminDashboard from "./pages/admin/Dashboard.tsx";
import Students from "./pages/admin/Students.tsx";
import Promotions from "./pages/admin/Promotions.tsx";
import Import from "./pages/admin/Import.tsx";
import Results from "./pages/admin/Results.tsx";
import AcademicYears from "./pages/admin/AcademicYears.tsx";
import AdminSettings from "./pages/admin/Settings.tsx";
import SuperAdminLayout from "./layouts/SuperAdminLayout.tsx";
import SuperAdminDashboard from "./pages/super-admin/Dashboard.tsx";
import Universities from "./pages/super-admin/Universities.tsx";
import Admins from "./pages/super-admin/Admins.tsx";
import AuditLogs from "./pages/super-admin/AuditLogs.tsx";
import SuperAdminSettings from "./pages/super-admin/Settings.tsx";
import StudentLayout from "./layouts/StudentLayout.tsx";
import StudentDashboard from "./pages/student/Dashboard.tsx";
import StudentResults from "./pages/student/Results.tsx";
import StudentPerformance from "./pages/student/Performance.tsx";
import StudentHistory from "./pages/student/History.tsx";
import StudentSettings from "./pages/student/Settings.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login/admin" element={<AdminLogin />} />
          <Route path="/login/student" element={<StudentLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="students" element={<Students />} />
            <Route path="promotions" element={<Promotions />} />
            <Route path="import" element={<Import />} />
            <Route path="results" element={<Results />} />
            <Route path="academic-years" element={<AcademicYears />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
          <Route path="/student" element={<StudentLayout />}>
            <Route index element={<StudentDashboard />} />
            <Route path="results" element={<StudentResults />} />
            <Route path="performance" element={<StudentPerformance />} />
            <Route path="history" element={<StudentHistory />} />
            <Route path="settings" element={<StudentSettings />} />
          </Route>
          <Route path="/super-admin" element={<SuperAdminLayout />}>
            <Route index element={<SuperAdminDashboard />} />
            <Route path="universities" element={<Universities />} />
            <Route path="admins" element={<Admins />} />
            <Route path="audit-logs" element={<AuditLogs />} />
            <Route path="settings" element={<SuperAdminSettings />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
