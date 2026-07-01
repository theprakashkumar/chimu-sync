import type {PermissionType} from "@chimu-sync/shared";
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {useAuthContext} from "@/context/auth-provider";
import useWorkspaceId from "@/hooks/use-workspace-id";

const withPermission = (
  WrappedComponent: React.ComponentType,
  requiredPermission: PermissionType,
) => {
  const WithPermission = (props: any) => {
    const navigate = useNavigate();
    const {user, hasPermission, authLoading} = useAuthContext();
    const workspaceId = useWorkspaceId();

    useEffect(() => {
      if (!user || !hasPermission(requiredPermission)) {
        navigate(`/workspace/${workspaceId}`);
      }
    }, [user, hasPermission, navigate, workspaceId]);

    if (authLoading) {
      return <div>Loading...</div>;
    }

    // Check if user has the required permission
    if (!user || !hasPermission(requiredPermission)) {
      return;
    }
    return <WrappedComponent {...props} />;
  };
  return WithPermission;
};

export default withPermission;
