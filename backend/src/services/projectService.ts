import ProjectModel from "../models/projectModel";
import { NotFoundException } from "../utils/appErrors";

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

export const getProjectByIdAndWorkspaceId = async (
  projectId: string,
  workspaceId: string
) => {
  const project = await ProjectModel.findOne({
    _id: projectId,
    workspace: workspaceId,
  }).select("_id emoji name description");

  if (!project) {
    throw new NotFoundException("Project not found!");
  }

  return { project };
};
