import { Outlet } from "react-router-dom";
import { AuthProvider } from "@/context/auth-provider";

const AppLayout = () => {
  return (
    <AuthProvider>
      <div className="w-full">
        <div className="px-3 lg:px-20 py-3">
          <Outlet />
        </div>
      </div>
    </AuthProvider>
  );
};

export default AppLayout;
