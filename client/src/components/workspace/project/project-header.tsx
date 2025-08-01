/* eslint-disable @typescript-eslint/no-explicit-any */
import useWorkspaceId from "@/hooks/use-workspace-id";
import CreateTaskDialog from "../task/create-task-dialog";
import EditProjectDialog from "./edit-project-dialog";
import useProjectId from "@/hooks/use-project-id";
import useGetProject from "@/hooks/api/use-get-project";

const ProjectHeader = () => {
  const projectId = useProjectId();
  const workspaceId = useWorkspaceId();

  const { data, isLoading, isError } = useGetProject({
    workspaceId,
    projectId,
  });

  const project = data?.project;

  // Fallback if no project data is found
  const projectEmoji = project?.emoji || "📊";
  const projectName = project?.name || "Untitled project";

  const renderContent = () => {
    if (isLoading) return <span>Loading...</span>;
    if (isError) return <span>Error occurred</span>;
    return (
      <>
        <span>{projectEmoji}</span>
        {projectName}
      </>
    );
  };
  return (
    <div className="flex items-center justify-between space-y-2">
      <div className="flex items-center gap-2">
        <h2 className="flex items-center gap-3 text-xl font-medium truncate tracking-tight">
          {renderContent()}
        </h2>
        <EditProjectDialog project={project} />
      </div>
      <CreateTaskDialog projectId={projectId} />
    </div>
  );
};

export default ProjectHeader;
