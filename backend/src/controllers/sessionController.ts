import { HTTPSTATUS } from "../config/httpConfig";
import { asyncHandler } from "../middlewares/asyncHandlerMiddleware";
import { Request, Response } from "express";
import { getAllSessionService } from "../services/sessionService";

const getAllSessionController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const sessionId = req.sessionId;
    const { sessions } = await getAllSessionService(userId);

    console.log()

    const modifiedSession = sessions.map((session) => ({
      ...session.toObject(),
      ...(session.id === sessionId ? { isCurrent: true } : { isCurrent: false })
    }));

    return res.status(HTTPSTATUS.OK).json({
      data: modifiedSession,
      message: "Fetched all session successfully!"
    })
  }
)

export { getAllSessionController };