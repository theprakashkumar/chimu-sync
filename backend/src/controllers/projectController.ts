import { asyncHandler } from "../middlewares/asyncHandlerMiddleware";
import { Request, Response } from "express";
import { createProjectSchema } from "../validation/projectValidation";
import { workspaceIdSchema } from "../validation/workspaceValidation";
import { getMemberRoleInWorkspace } from "../services/memberService";
import { roleGuard } from "../utils/roleGuard";
import { Permissions } from "../enums/roleEnum";
import { createProjectService } from "../services/projectService";
import { HTTPSTATUS } from "../config/httpConfig";

export const createProjectController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = createProjectSchema.parse(req.body);
    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);

    const userId = req.user?._id;
    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.CREATE_PROJECT]);

    const { project } = await createProjectService(userId, workspaceId, body);

    res.status(HTTPSTATUS.CREATED).json({
      message: "Project created successfully.",
      project,
    });
  }
);
