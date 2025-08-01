import { getProjectByIdQueryFn } from "@/lib/api";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

const useGetProject = ({
  workspaceId,
  projectId,
}: {
  workspaceId: string;
  projectId: string;
}) => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => getProjectByIdQueryFn({ workspaceId, projectId }),
    staleTime: Infinity,
    placeholderData: keepPreviousData,
    enabled: !!projectId || !!workspaceId,
  });

  return { data, isLoading, isError, refetch };
};

export default useGetProject;
