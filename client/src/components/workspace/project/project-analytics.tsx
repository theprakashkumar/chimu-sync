import { useQuery } from "@tanstack/react-query";
import AnalyticsCard from "../common/analytics-card";
import useProjectId from "@/hooks/use-project-id";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { getProjectAnalyticsQueryFn } from "@/lib/api";

const ProjectAnalytics = () => {
  const projectId = useProjectId();
  const workspaceId = useWorkspaceId();
  const { data, isPending } = useQuery({
    queryKey: ["project", "projectAnalytics", projectId],
    queryFn: () => getProjectAnalyticsQueryFn({ workspaceId, projectId }),
    staleTime: 0,
    enabled: !!projectId,
  });
  const analytics = data?.analytics;

  return (
    <div className="grid gap-4 md:gap-5 lg:grid-cols-2 xl:grid-cols-3">
      <AnalyticsCard
        isLoading={isPending}
        title="Total Task"
        value={analytics?.totalTasks || 0}
      />
      <AnalyticsCard
        isLoading={isPending}
        title="Overdue Task"
        value={analytics?.overdueTasks || 0}
      />
      <AnalyticsCard
        isLoading={isPending}
        title="Completed Task"
        value={analytics?.completedTasks || 0}
      />
    </div>
  );
};

export default ProjectAnalytics;
