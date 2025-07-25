/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext, useEffect } from "react";
// import useWorkspaceId from "@/hooks/use-workspace-id";
import useAuth from "@/hooks/api/use-auth";
import { UserType, WorkspaceType } from "@/types/api.type";
import useWorkspaceId from "@/hooks/use-workspace-id";
import useGetWorkspace from "@/hooks/api/useGetWorkspace";

// Define the context shape
type AuthContextType = {
  user?: UserType;
  workspace?: WorkspaceType;
  error: any;
  authLoading: boolean;
  workspaceLoading: boolean;
  authFetch: boolean;
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
    error: workspaceError,
    refetch: refetchWorkspace,
  } = useGetWorkspace(workspaceId);

  const workspace = workspaceData?.workspace;
  // Checking if user can access of the workspace.
  useEffect(() => {});

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
        error: authError || workspaceError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useCurrentUserContext must be used within a AuthProvider");
  }
  return context;
};
