import mongoose from "mongoose";
import ProjectModel from "../models/projectModel";
import TaskModel from "../models/taskModel";
import { NotFoundException } from "../utils/appErrors";
import { TaskStatusEnum } from "../enums/taskEnum";

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

export const getProjectAnalyticsService = async (
  projectId: string,
  workspaceId: string
) => {
  const project = await ProjectModel.findById(projectId);

  // If project don't exits or project's workspace id don't match with workspaceId.
  if (!project || project.workspace.toString() !== workspaceId) {
    throw new NotFoundException(
      "Project not found or does not belong to this workspace."
    );
  }

  const currentDate = new Date();
  // Using mongoose aggregate.
  // This code block is responsible for generating analytics about tasks within a specific project.
  // It uses MongoDB's aggregation framework, which is a powerful tool for processing data records and returning computed results.
  // Aggregation allows you to perform operations like filtering, grouping, and transforming data in a pipeline of stages.

  // The $facet stage in aggregation is particularly useful because it lets you run multiple aggregations in parallel on the same set of input documents.
  // Each facet can perform its own pipeline of operations, and the results are returned together in a single document.

  // Here’s what the code does step by step:
  // 1. It matches all tasks that belong to the given project using the $match stage.
  // 2. It then uses the $facet stage to run three parallel aggregations:
  //    - totalTasks: Counts the total number of tasks in the project.
  //    - overdueTasks: Counts the number of tasks that are overdue (dueDate is before the current date and status is not DONE).
  //    - completedTasks: Counts the number of tasks that have been completed (status is DONE).
  // 3. The result of the aggregation is an array with a single object, where each key (totalTasks, overdueTasks, completedTasks) contains an array with the count.
  // 4. The code extracts the counts from these arrays, defaulting to 0 if no tasks are found.

  const taskAnalytics = await TaskModel.aggregate([
    {
      $match: {
        project: new mongoose.Types.ObjectId(projectId),
      },
    },
    {
      $facet: {
        totalTasks: [{ $count: "count" }],
        overdueTasks: [
          {
            $match: {
              dueDate: { $lt: currentDate },
              status: {
                $ne: TaskStatusEnum.DONE,
              },
            },
          },
          {
            $count: "count",
          },
        ],
        completedTasks: [
          {
            $match: {
              status: TaskStatusEnum.DONE,
            },
          },
          { $count: "count" },
        ],
      },
    },
  ]);

  // Extract the analytics data from the aggregation result.
  const _analytics = taskAnalytics[0];

  // Prepare the analytics object with the counts, defaulting to 0 if not present.
  const analytics = {
    totalTasks: _analytics.totalTasks[0]?.count || 0,
    overdueTasks: _analytics.overdueTasks[0]?.count || 0,
    completedTasks: _analytics.completedTasks[0]?.count || 0,
  };

  return { analytics };
};
