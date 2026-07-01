import { Outlet } from "react-router-dom";
import StandaloneAsidebar from "@/components/asidebar/standalone-asidebar";
import Header from "@/components/header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import CreateWorkspaceDialog from "@/components/workspace/create-workspace-dialog";
import CreateProjectDialog from "@/components/workspace/project/create-project-dialog";
import { AuthProvider } from "@/context/auth-provider";

const StandaloneLayout = () => {
  return (
    <AuthProvider>
      <SidebarProvider>
        <StandaloneAsidebar />
        <SidebarInset className="overflow-x-hidden">
          <div className="w-full">
            <>
              <Header />
              <div className="px-3 lg:px-20 py-3">
                <Outlet />
              </div>
            </>
            <CreateWorkspaceDialog />
            <CreateProjectDialog />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </AuthProvider>
  );
};

export default StandaloneLayout;
