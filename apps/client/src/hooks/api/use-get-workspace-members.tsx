import { getMembersInWorkspaceQueryFn } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

const useGetWorkspaceMember = (workspaceId: string) => {
  const query = useQuery({
    queryKey: ["members", workspaceId],
    queryFn: () => getMembersInWorkspaceQueryFn(workspaceId),
    staleTime: Infinity,
  });
  return query;
};

export default useGetWorkspaceMember;
