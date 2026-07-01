import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getProjectByIdQueryFn } from "@/lib/api";

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
    staleTime: 0,
    placeholderData: keepPreviousData,
    enabled: !!projectId || !!workspaceId,
  });

  return { data, isLoading, isError, refetch };
};

export default useGetProject;
