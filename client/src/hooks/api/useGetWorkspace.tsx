import { createWorkspaceMutationFn } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

const useGetWorkspace = (workspaceId: string) => {
  // staleTime: 0 means the cached data is considered immediately stale,
  // so every time this hook is used, it will refetch the data from the server.
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["workspace", "workspaceId"],
    queryFn: () => createWorkspaceMutationFn(workspaceId),
    staleTime: 0, // disables caching, always refetches
    retry: 2,
    enabled: !!workspaceId,
  });

  return { data, isLoading, error, refetch };
};

export default useGetWorkspace;
