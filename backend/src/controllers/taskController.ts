import { HTTPSTATUS } from "../config/httpConfig";
import { Permissions } from "../enums/roleEnum";
import { asyncHandler } from "../middlewares/asyncHandlerMiddleware";
import { getMemberRoleInWorkspace } from "../services/memberService";
import {
  createTaskService,
  getAllTaskService,
  updateTaskService,
} from "../services/taskService";
import { roleGuard } from "../utils/roleGuard";
import { projectIdSchema } from "../validation/projectValidation";
import {
  createTaskSchema,
  taskIdSchema,
  updateTaskSchema,
} from "../validation/taskValidation";
import { workspaceIdSchema } from "../validation/workspaceValidation";
import { Request, Response } from "express";

export const createTaskController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = createTaskSchema.parse(req.body);
    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
    const projectId = projectIdSchema.parse(req.params.projectId);

    const userId = req.user?._id;
    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.CREATE_TASK]);

    const { task } = await createTaskService(
      userId,
      workspaceId,
      projectId,
      body
    );

    res.status(HTTPSTATUS.CREATED).json({
      message: "Task created successfully.",
      task,
    });
  }
);

export const updateTaskController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = updateTaskSchema.parse(req.body);
    const taskId = taskIdSchema.parse(req.params.id);
    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
    const projectId = projectIdSchema.parse(req.params.projectId);

    const userId = req.user?._id;
    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.EDIT_TASK]);

    const { task } = await updateTaskService(
      workspaceId,
      projectId,
      taskId,
      body
    );

    res.status(HTTPSTATUS.CREATED).json({
      message: "Task updated successfully.",
      task,
    });
  }
);

export const getAllTaskController = asyncHandler(
  async (req: Request, res: Response) => {
    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);

    const userId = req.user?._id;
    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.VIEW_ONLY]);

    const filters = {
      projectId: req.query.projectId as string | undefined,
      status: req.query.status
        ? (req.query.status as string)?.split(",")
        : undefined,
      priority: req.query.priority
        ? (req.query.priority as string)?.split(",")
        : undefined,
      assignedTo: req.query.assignedTo
        ? (req.query.assignedTo as string)?.split(",")
        : undefined,
      keyword: req.query.keyword as string | undefined,
      dueDate: req.query.dueDate as string | undefined,
    };

    const pagination = {
      pageSize: parseInt(req.query.pageSize as string) || 10,
      pageNumber: parseInt(req.query.pageNumber as string) || 1,
    };

    const result = await getAllTaskService(workspaceId, filters, pagination);

    res.status(HTTPSTATUS.OK).json({
      message: "Tasks fetched successfully.",
      ...result,
    });
  }
);
