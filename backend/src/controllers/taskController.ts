import { HTTPSTATUS } from "../config/httpConfig";
import { Permissions } from "../enums/roleEnum";
import { asyncHandler } from "../middlewares/asyncHandlerMiddleware";
import { getMemberRoleInWorkspace } from "../services/memberService";
import { createTaskService } from "../services/taskService";
import { roleGuard } from "../utils/roleGuard";
import { projectIdSchema } from "../validation/projectValidation";
import { createTaskSchema } from "../validation/taskValidation";
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
