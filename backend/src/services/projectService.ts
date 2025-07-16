import ProjectModel from "../models/projectModel";

export const createProjectService = async (
  userId: string,
  workspaceId: string,
  body: {
    emoji?: string;
    name: string;
    description?: string;
  }
) => {
  const project = new ProjectModel({
    ...(body.emoji && { emoji: body.emoji }),
    name: body.name,
    description: body.description,
    workspace: workspaceId,
    createdBy: userId,
  });

  await project.save();

  return { project };
};

export const getAllProjectByWorkspaceIdService = async (
  workspaceId: string,
  pageSize: number,
  pageNumber: number
) => {
  // Find all project in the workspace.
  const totalCount = await ProjectModel.countDocuments({
    workspace: workspaceId,
  });
  // Number of document to skip
  const skip = (pageNumber - 1) * pageSize;
  const projects = await ProjectModel.find({
    workspace: workspaceId,
  })
    .skip(skip)
    .limit(pageSize)
    .populate("createdBy", "_id name profilePicture -password")
    .sort({ createdAt: -1 });

  const totalPages = Math.ceil(totalCount / pageSize);

  return { projects, totalCount, totalPages, skip };
};
