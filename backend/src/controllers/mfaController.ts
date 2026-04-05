import { asyncHandler } from "../middlewares/asyncHandlerMiddleware";
import { Request, Response } from "express";
import { generateMFASetupService } from "../services/mfaService";
import { HTTPSTATUS } from "../config/httpConfig";

const generateMFASetupController = asyncHandler(
  async (req: Request, res: Response) => {
    const { secret, qrCode, message } = await generateMFASetupService(req);
    return res.status(HTTPSTATUS.OK).json({
      secret,
      qrCode,
      message
    })
  }
)

export { generateMFASetupController };