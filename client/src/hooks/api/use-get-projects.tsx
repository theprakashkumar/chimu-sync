import { getProjectsInWorkspaceQueryFn } from "@/lib/api";
import { AllProjectPayloadType } from "@/types/api.type";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

const useGetProjects = ({
  workspaceId,
  pageSize,
  pageNumber,
  skip = false,
}: AllProjectPayloadType) => {
  /**
   * The `placeholderData` option in useQuery is used here to provide a temporary value
   * while fetching new data, specifically when paginating (changing pageNumber or pageSize).
   *
   * - `keepPreviousData` tells React Query to keep showing the previous page's data
   *   until the new data arrives, instead of showing a loading state or empty UI.
   * - This is useful for paginated lists, as it prevents UI flicker and provides a smoother experience.
   * - If `skip` is true, we don't provide placeholder data (set to undefined),
   *   because the query is disabled and we don't want to show stale data.
   */
  const query = useQuery({
    queryKey: ["allProject", workspaceId, pageSize, pageNumber],
    queryFn: () =>
      getProjectsInWorkspaceQueryFn({
        workspaceId,
        pageSize,
        pageNumber,
        skip,
      }),
    staleTime: Infinity,
    placeholderData: skip ? undefined : keepPreviousData,
    enabled: !skip,
  });

  return query;
};

export default useGetProjects;
