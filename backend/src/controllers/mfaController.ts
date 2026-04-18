import { asyncHandler } from "../middlewares/asyncHandlerMiddleware";
import { Request, Response } from "express";
import { generateMFASetupService, revokeMFAService, verifyMFAForLoginService, verifyMFASetupService } from "../services/mfaService";
import { HTTPSTATUS } from "../config/httpConfig";
import { verifyMFAForLoginSchema, verifyMFASchema } from "../validation/mfaValidation";
import { clearMfaTokenCookie, setAuthenticationCookies } from "../utils/cookie";

const generateMFASetupController = asyncHandler(
  async (req: Request, res: Response) => {
    const { data, message } = await generateMFASetupService(req);
    return res.status(HTTPSTATUS.OK).json({
      data,
      message
    })
  }
)

const verifyMFASetupController = asyncHandler(
  async (req: Request, res: Response) => {
    const { code, secretKey } = await verifyMFASchema.parse(req.body);

    const { userPreferences, message } = await verifyMFASetupService(req, code, secretKey)

    return res.status(HTTPSTATUS.OK).json({
      userPreferences,
      message
    })
  }
);

const revokeMFAController = asyncHandler(
  async (req: Request, res: Response) => {
    const { message, userPreferences } = await revokeMFAService(req);

    return res.status(HTTPSTATUS.OK).json({
      message,
      userPreferences,
    })
  }
);

const verifyMFAForLoginController = asyncHandler(
  async (req: Request, res: Response) => {
    const { code, userAgent } = verifyMFAForLoginSchema.parse({
      ...req.body,
      userAgent: req.headers['user-agent'],
    });

    const mfaChallengeToken = req.cookies?.mfaChallengeToken;

    const { user, accessToken, refreshToken } = await verifyMFAForLoginService(code, mfaChallengeToken, userAgent);

    return setAuthenticationCookies({ res: clearMfaTokenCookie(res), accessToken, refreshToken })
      .status(HTTPSTATUS.OK)
      .json({
        user,
        message: "Verified & login successfully!",
      })
  }
);

export {
  generateMFASetupController,
  verifyMFASetupController,
  revokeMFAController,
  verifyMFAForLoginController
};
