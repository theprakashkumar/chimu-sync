import type { Request, Response } from "express";
import { HTTPSTATUS } from "../config/httpConfig";
import { asyncHandler } from "../middlewares/asyncHandlerMiddleware";
import {
  generateMFASetupService,
  revokeMFAService,
  verifyMFAForLoginService,
  verifyMFASetupService,
} from "../services/mfaService";
import { clearMfaTokenCookie, setAuthenticationCookies } from "../utils/cookie";
import {
  verifyMFAForLoginSchema,
  verifyMFASchema,
} from "../validation/mfaValidation";

export const generateMFASetupController = asyncHandler(
  async (req: Request, res: Response) => {
    const { data, message } = await generateMFASetupService(req);
    return res.status(HTTPSTATUS.OK).json({
      data,
      message,
    });
  },
);

export const verifyMFASetupController = asyncHandler(
  async (req: Request, res: Response) => {
    const { code, secretKey } = await verifyMFASchema.parse(req.body);

    const { userPreferences, message } = await verifyMFASetupService(
      req,
      code,
      secretKey,
    );

    return res.status(HTTPSTATUS.OK).json({
      userPreferences,
      message,
    });
  },
);

export const revokeMFAController = asyncHandler(
  async (req: Request, res: Response) => {
    const { message, userPreferences } = await revokeMFAService(req);

    return res.status(HTTPSTATUS.OK).json({
      message,
      userPreferences,
    });
  },
);

export const verifyMFAForLoginController = asyncHandler(
  async (req: Request, res: Response) => {
    const { code, userAgent } = verifyMFAForLoginSchema.parse({
      ...req.body,
      userAgent: req.headers["user-agent"],
    });

    const mfaChallengeToken = req.cookies?.mfaChallengeToken;

    const { user, accessToken, refreshToken } = await verifyMFAForLoginService(
      code,
      mfaChallengeToken,
      userAgent,
    );

    return setAuthenticationCookies({
      res: clearMfaTokenCookie(res),
      accessToken,
      refreshToken,
    })
      .status(HTTPSTATUS.OK)
      .json({
        user,
        message: "Verified & login successfully!",
      });
  },
);
