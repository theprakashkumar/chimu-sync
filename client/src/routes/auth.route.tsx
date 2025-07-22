import { DashboardSkeleton } from "@/components/skeleton-loaders/dashboard-skeleton";
import useAuth from "@/hooks/api/use-auth";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isAuthRoute } from "./common/routePaths";

const AuthRoute = () => {
  const location = useLocation();
  const { data: authData, isLoading } = useAuth();
  const user = authData?.user;
  // isAuthRoute given use the login routes.
  const isLoginRoute = isAuthRoute(location.pathname);
  // If login/signup route then don't show the loading screen.
  if (isLoading && !isLoginRoute) return <DashboardSkeleton />;
  if (!user) return <Outlet />;
  return <Navigate to={`workspace/${user.currentWorkspace?._id}`} />;
};

export default AuthRoute;
