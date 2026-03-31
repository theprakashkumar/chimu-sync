import { appConfig } from "../config/appConfig";
import { asyncHandler } from "../middlewares/asyncHandlerMiddleware";
import { NextFunction, Request, Response } from "express";
import { loginSchema, registerSchema } from "../validation/authValidation";
import { HTTPSTATUS } from "../config/httpConfig";
import { loginUserService, refreshTokenService, registerUserService } from "../services/authService";
import { setAuthenticationCookies } from "../utils/cookie";
import { UnauthorizedException } from "../utils/appErrors";

const registerUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = registerSchema.parse({ ...req.body });
    const { user } = await registerUserService(body);

    return res.status(HTTPSTATUS.CREATED).json({
      message: "User created successfully",
      data: user
    });
  }
);

const loginController = asyncHandler(
  async (req: Request, res: Response) => {
    const userAgent = req.header("user-agent");

    const body = loginSchema.parse({
      ...req.body,
      userAgent
    })

    const { user, accessToken, refreshToken, mfaRequired } = await loginUserService(body)

    return setAuthenticationCookies({
      res, accessToken, refreshToken
    })
      .status(HTTPSTATUS.OK)
      .json({
        message: "User login successfully!",
        data: user
      })
  }
);

const refreshTokenController = asyncHandler(
  async (req: Request, res: Response) => {
    const refreshToken: string | undefined = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException("User not authorized!");
    }

    await refreshTokenService(refreshToken);
  }
)

const googleLoginCallback = asyncHandler(
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

const logOutController = asyncHandler(
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

export { registerUserController, loginController, refreshTokenController, googleLoginCallback, logOutController }