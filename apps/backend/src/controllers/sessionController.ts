import { HTTPSTATUS } from "../config/httpConfig";
import { asyncHandler } from "../middlewares/asyncHandlerMiddleware";
import { Request, Response } from "express";
import { deleteSessionService, getAllSessionService, getCurrentSessionService } from "../services/sessionService";
import { NotFoundException } from "../utils/appErrors";
import z from "zod";

export const getAllSessionController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const sessionId = req.sessionId;
    const sessions = await getAllSessionService(userId);

    const modifiedSession = sessions.map((session) => ({
      ...session.toObject(),
      ...(session.id === sessionId ? { isCurrent: true } : { isCurrent: false })
    }));

    return res.status(HTTPSTATUS.OK).json({
      sessions: modifiedSession,
      message: "Fetched all session successfully!"
    })
  }
);

export const getCurrentSessionController = asyncHandler(
  async (req: Request, res: Response) => {
    const sessionId = req.sessionId;
    if (!sessionId) {
      throw new NotFoundException("Session ID not found, please login!");
    }

    const user = await getCurrentSessionService(sessionId);

    return res.status(HTTPSTATUS.OK).json({
      data: user,
      message: "Fetched current session successfully!"
    })
  }
);

export const deleteSessionController = asyncHandler(
  async (req: Request, res: Response) => {
    const sessionId = z.string().parse(req.params.id);
    const userId = req.user?.id;

    const deletedSession = await deleteSessionService(sessionId, userId);

    return res.status(HTTPSTATUS.OK).json({
      data: deletedSession,
      message: "Session is deleted successfully!"
    });
  }
);
