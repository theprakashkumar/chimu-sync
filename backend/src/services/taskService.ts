import { TaskPriorityEnum, TaskStatusEnum } from "../enums/taskEnum";
import MemberModel from "../models/memberModel";
import ProjectModel from "../models/projectModel";
import TaskModel from "../models/taskModel";
import { BadRequestException, NotFoundException } from "../utils/appErrors";

export const createTaskService = async (
  userId: string,
  workspaceId: string,
  projectId: string,
  body: {
    title: string;
    description?: string;
    priority: string;
    status: string;
    assignedTo?: string | null;
    dueDate?: string;
  }
) => {
  const { title, description, priority, status, assignedTo, dueDate } = body;

  const project = await ProjectModel.findById(projectId);
  // If project don't exits or workspace id in the project don't match with given workspace id.
  if (!project || project.workspace.toString() !== workspaceId.toString()) {
    throw new NotFoundException(
      "Project not found or does not belong to this workspace."
    );
  }
  // Check if assignedTo exists in Member model with give workspace.
  if (assignedTo) {
    const isAssignedUserMember = await MemberModel.exists({
      userId: assignedTo,
      workspaceId,
    });
    if (!isAssignedUserMember) {
      throw new Error("Assigned user is not a member fo this workspace.");
    }
  }
  const task = new TaskModel({
    title,
    description,
    priority: priority || TaskPriorityEnum.MEDIUM,
    status: status || TaskStatusEnum.TODO,
    assignedTo,
    createdBy: userId,
    workspace: workspaceId,
    project: projectId,
    dueDate,
  });

  await task.save();

  return { task };
};

export const updateTaskService = async (
  workspaceId: string,
  projectId: string,
  taskId: string,
  body: {
    title: string;
    description?: string;
    priority?: string;
    status?: string;
    assignedTo?: string | null;
    dueDate?: string;
  }
) => {
  const project = await ProjectModel.findById(projectId);
  // If project don't exits or workspace id in the project don't match with given workspace id.
  if (!project || project.workspace.toString() !== workspaceId.toString()) {
    throw new NotFoundException(
      "Project not found or does not belong to this workspace."
    );
  }

  const task = await TaskModel.findById(taskId);

  if (!task || task.project.toString() !== projectId.toString()) {
    throw new NotFoundException(
      "Task not found or does not belong to this project."
    );
  }

  const { title, description, priority, status, assignedTo, dueDate } = body;
  // If we set new is true it will return the update task.
  const updatedTask = await TaskModel.findByIdAndUpdate(
    taskId,
    {
      title,
      description,
      priority: priority,
      status: status,
      assignedTo,
      dueDate,
    },
    { new: true }
  );

  if (!updatedTask) {
    throw new BadRequestException("Failed to update the task.");
  }

  return { task: updatedTask };
};
