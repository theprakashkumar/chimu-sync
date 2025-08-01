import { getWorkspaceByIdQueryFn } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

const useGetWorkspace = (workspaceId: string) => {
  // staleTime: 0 means the cached data is considered immediately stale,
  // so every time this hook is used, it will refetch the data from the server.
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["workspace", "workspaceId"],
    queryFn: () => getWorkspaceByIdQueryFn(workspaceId),
    staleTime: 0, // disables caching, always refetches
    retry: 2,
    enabled: !!workspaceId,
  });

  return { data, isLoading, isError, refetch };
};

export default useGetWorkspace;
