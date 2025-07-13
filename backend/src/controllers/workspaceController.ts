import { asyncHandler } from "../middlewares/asyncHandlerMiddleware";
import { Request, Response } from "express";
import {
  changeRoleSchema,
  createWorkspaceSchema,
} from "../validation/workspaceValidation";
import { HTTPSTATUS } from "../config/httpConfig";
import {
  changeMemberRoleService,
  createWorkspaceService,
  getAllWorkspaceISMemberService,
  getWorkspaceAnalyticsService,
  getWorkspaceByIdService,
  getWorkspaceMembersService,
} from "../services/workspaceService";
import { getMemberRoleInWorkspace } from "../services/memberService";
import { Permissions } from "../enums/roleEnum";
import { roleGuard } from "../utils/roleGuard";

export const createWorkspaceController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = createWorkspaceSchema.parse(req.body);

    const userId = req.user?._id;

    const { workspace } = await createWorkspaceService(userId, body);

    return res.status(HTTPSTATUS.CREATED).json({
      message: "Workspace created successfully",
      workspace,
    });
  }
);

export const getAllWorkspaceUserIsMemberController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;

    const { workspace } = await getAllWorkspaceISMemberService(userId);

    return res.status(HTTPSTATUS.OK).json({
      message: "User workspace fetched successfully.",
      workspace,
    });
  }
);

export const getWorkspaceByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const workspaceId = req.params.id;
    const userId = req.user?._id;

    const { workspace } = await getWorkspaceByIdService(workspaceId, userId);

    return res.status(HTTPSTATUS.OK).json({
      message: "Workspace fetched successfully.",
      workspace,
    });
  }
);

export const getWorkspaceMembersController = asyncHandler(
  async (req: Request, res: Response) => {
    const workspaceId = req.params.id;
    const userId = req.user?._id;

    // User should be the member of workspace in order to access the workspace.
    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);

    // Only allow to access workspace if there is permission.
    roleGuard(role, [Permissions.VIEW_ONLY]);

    const { members, roles } = await getWorkspaceMembersService(workspaceId);

    return res.status(HTTPSTATUS.OK).json({
      message: "Members fetched successfully.",
      members,
      roles,
    });
  }
);

export const getWorkspaceAnalyticsController = asyncHandler(
  async (req: Request, res: Response) => {
    const workspaceId = req.params.id;
    const userId = req.user?._id;

    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.VIEW_ONLY]);

    const { analytics } = await getWorkspaceAnalyticsService(workspaceId);

    return res.status(HTTPSTATUS.OK).json({
      message: "Workspace analytics fetched successfully.",
      analytics,
    });
  }
);

export const changeWorkspaceMemberRoleController = asyncHandler(
  async (req: Request, res: Response) => {
    const workspaceId = req.params.id;
    const { memberId, roleId } = changeRoleSchema.parse(req.body);

    const userId = req.user?._id;
    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    // Only owner can change role member to admin.
    // One can change there own role.
    roleGuard(role, [Permissions.CHANGE_MEMBER_ROLE]);

    const { member } = await changeMemberRoleService(
      workspaceId,
      memberId,
      roleId
    );

    return res.status(HTTPSTATUS.OK).json({
      message: "Member role changed successfully.",
      member,
    });
  }
);
