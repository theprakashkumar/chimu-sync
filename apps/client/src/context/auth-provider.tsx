/* eslint-disable @typescript-eslint/no-explicit-any */

import type {
  PermissionType,
  UserType,
  WorkspaceType,
} from "@chimu-sync/shared";
import { createContext, useContext } from "react";
import useAuth from "@/hooks/api/use-auth";
import useGetWorkspace from "@/hooks/api/use-get-workspace";
import usePermissions from "@/hooks/use-permissions";
import useWorkspaceId from "@/hooks/use-workspace-id";

// Define the context shape
type AuthContextType = {
  user?: UserType;
  workspace?: WorkspaceType;
  error: any;
  authLoading: boolean;
  workspaceLoading: boolean;
  authFetch: boolean;
  hasPermission: (permission: PermissionType) => boolean;
  refetchAuth: () => void;
  refetchWorkspace: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const workspaceId = useWorkspaceId();

  const {
    data: authData,
    error: authError,
    isLoading: authLoading,
    isFetching: authFetch,
    refetch: refetchAuth,
  } = useAuth();

  const user = authData?.user;

  const {
    data: workspaceData,
    isLoading: workspaceLoading,
    isError: workspaceError,
    refetch: refetchWorkspace,
  } = useGetWorkspace(workspaceId);

  const workspace = workspaceData?.workspace;

  const permissions = usePermissions(user, workspace);
  const hasPermission = (permission: PermissionType): boolean => {
    return permissions.includes(permission);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        workspace,
        authLoading,
        authFetch,
        refetchAuth: refetchAuth,
        workspaceLoading,
        refetchWorkspace,
        hasPermission,
        error: authError || workspaceError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useCurrentUserContext must be used within a AuthProvider");
  }
  return context;
};
