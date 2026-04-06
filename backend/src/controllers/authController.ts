import { appConfig } from "../config/appConfig";
import { asyncHandler } from "../middlewares/asyncHandlerMiddleware";
import { Request, Response } from "express";
import { emailSchema, loginSchema, registerSchema, resetPasswordSchema, verificationEmailSchema } from "../validation/authValidation";
import { HTTPSTATUS } from "../config/httpConfig";
import { forgotPasswordService, loginUserService, logoutService, refreshTokenService, registerUserService, resetPasswordService, verifyEmailService } from "../services/authService";
import { clearAuthenticationCookie, getAccessTokenCookieOptions, setAuthenticationCookies } from "../utils/cookie";
import { NotFoundException, UnauthorizedException } from "../utils/appErrors";

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

    if (mfaRequired) {
      return res.status(HTTPSTATUS.OK).json({
        message: "Verify MFA to login!",
        data: {
          user,
          mfaRequired
        }
      })
    }

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

    const { accessToken, newRefreshToken } = await refreshTokenService(refreshToken);
    // If new refresh token the add it to cookie.
    if (newRefreshToken) {
      res.cookie("refreshToken", newRefreshToken, getAccessTokenCookieOptions())
    }

    return res
      .status(HTTPSTATUS.OK)
      .cookie("accessToken", accessToken, getAccessTokenCookieOptions())
      .json({ message: "Refresh access token successfully!" })
  }
)

const verifyEmailController = asyncHandler(
  async (req: Request, res: Response) => {
    const { code } = verificationEmailSchema.parse(req.body);
    await verifyEmailService(code);

    return res.status(HTTPSTATUS.OK).json({
      message: "Email verified successfully!"
    });
  }
);

const forgotPasswordController = asyncHandler(
  async (req: Request, res: Response) => {
    const email = emailSchema.parse(req.body.email);

    await forgotPasswordService(email);

    // Clear all the cookies.
    return clearAuthenticationCookie(res).status(HTTPSTATUS.OK).json({
      message: "Email sent successfully!"
    })
  }
);

const resetPasswordController = asyncHandler(
  async (req: Request, res: Response) => {
    const { password, verificationCode } = resetPasswordSchema.parse(req.body);

    await resetPasswordService({ password, verificationCode });

    return res.status(HTTPSTATUS.OK).json({
      message: "Reset password successfully!"
    })
  }
);

const logOutController = asyncHandler(
  async (req: Request, res: Response) => {
    const sessionId = req.sessionId;
    if (!sessionId) {
      throw new NotFoundException("Session is invalid!")
    }

    await logoutService(sessionId);

    return clearAuthenticationCookie(res)
      .status(HTTPSTATUS.OK)
      .json({ message: "Logged out successfully" });
  }
);

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



export {
  registerUserController,
  loginController,
  refreshTokenController,
  verifyEmailController,
  forgotPasswordController,
  resetPasswordController,
  logOutController,
  googleLoginCallback
};