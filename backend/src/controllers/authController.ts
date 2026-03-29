import { appConfig } from "../config/appConfig";
import { asyncHandler } from "../middlewares/asyncHandlerMiddleware";
import { NextFunction, Request, Response } from "express";
import { loginSchema, registerSchema } from "../validation/authValidation";
import { HTTPSTATUS } from "../config/httpConfig";
import { loginUserService, registerUserService } from "../services/authService";

export const registerUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = registerSchema.parse({ ...req.body });
    const { user } = await registerUserService(body);

    return res.status(HTTPSTATUS.CREATED).json({
      message: "User created successfully",
      data: user
    });
  }
);

export const loginController = asyncHandler(
  async (req: Request, res: Response) => {
    const userAgent = req.header("user-agent");

    const body = loginSchema.parse({
      ...req.body,
      userAgent
    })

    const { user, accessToken, refreshToken, mfaRequired } = await loginUserService(body)

    return res.status(HTTPSTATUS.OK).json({
      message: "User login successfully!",
      data: user
    })
  }
);

export const googleLoginCallback = asyncHandler(
  async (req: Request, res: Response) => {
    const jwt = req.jwt;
    const currentWorkspace = req.user?.currentWorkspace;

    if (!jwt) {
      return res.redirect(
        `${appConfig.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`
      );
    }

    // return res.redirect(
    //   `${appConfig.FRONTEND_ORIGIN}/workspace/${currentWorkspace}`
    // );

    return res.redirect(
      `${appConfig.FRONTEND_GOOGLE_CALLBACK_URL}?status=success&access_token=${jwt}&current_workspace=${currentWorkspace}`
    );
  }
);

export const logOutController = asyncHandler(
  async (req: Request, res: Response) => {
    req.logout((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res
          .status(HTTPSTATUS.INTERNAL_SERVER_ERROR)
          .json({ error: "Failed to log out" });
      }
    });

    // req.session = null;
    return res
      .status(HTTPSTATUS.OK)
      .json({ message: "Logged out successfully" });
  }
);
