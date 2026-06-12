import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandlerMiddleware";
import { HTTPSTATUS } from "../config/httpConfig";
import { getCurrentUserService } from "../services/userService";

export const getCurrentUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;

    const { user } = await getCurrentUserService(userId);

    return res.status(HTTPSTATUS.OK).json({
      message: "Successfully got the user!",
      user,
    });
  }
);
