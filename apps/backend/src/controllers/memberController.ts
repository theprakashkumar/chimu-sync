import type { Request, Response } from "express";
import { z } from "zod";
import { HTTPSTATUS } from "../config/httpConfig";
import { asyncHandler } from "../middlewares/asyncHandlerMiddleware";
import { joinWorkspaceByInviteService } from "../services/memberService";

export const joinedWorkspaceController = asyncHandler(
  async (req: Request, res: Response) => {
    // Validation
    const inviteCode = z.string().parse(req.params.inviteCode);
    // User needs to be singed in before joining the workspace.
    const userId = req.user?._id;

    const { workspaceId, role } = await joinWorkspaceByInviteService(
      userId,
      inviteCode,
    );

    return res.status(HTTPSTATUS.OK).json({
      message: "Successfully joined the workspace.",
      workspaceId,
      role,
    });
  },
);
