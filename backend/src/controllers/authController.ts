import { asyncHandler } from "../middlewares/asyncHandlerMiddleware";
import { Request, Response } from "express";
import { emailSchema, loginSchema, registerSchema, resetPasswordSchema, verificationEmailSchema } from "../validation/authValidation";
import { HTTPSTATUS } from "../config/httpConfig";
import { forgotPasswordService, loginUserService, logoutService, refreshTokenService, registerUserService, resetPasswordService, verifyEmailService } from "../services/authService";
import { clearAuthenticationCookie, getAccessTokenCookieOptions, getRefreshTokenCookieOptions, setAuthenticationCookies, setMfaTokenCookie } from "../utils/cookie";
import { NotFoundException, UnauthorizedException } from "../utils/appErrors";

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

    const result = await loginUserService(body);
    if (result.mfaRequired) {
      return setMfaTokenCookie({ res, mfaChallengeToken: result.mfaChallengeToken })
        .status(HTTPSTATUS.OK)
        .json({
          message: "Verify MFA to login!",
          data: { mfaRequired: true },
        });
    }

    return setAuthenticationCookies({
      res,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    })
      .status(HTTPSTATUS.OK)
      .json({
        message: "User login successfully!",
        data: {
          user: result.user,
          mfaRequired: false,
        },
      });
  }
);

export const refreshTokenController = asyncHandler(
  async (req: Request, res: Response) => {
    const refreshToken: string | undefined = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException("User not authorized!");
    }

    const { accessToken, newRefreshToken } = await refreshTokenService(refreshToken);
    // If new refresh token the add it to cookie.
    if (newRefreshToken) {
      res.cookie("refreshToken", newRefreshToken, getRefreshTokenCookieOptions())
    }

    return res
      .status(HTTPSTATUS.OK)
      .cookie("accessToken", accessToken, getAccessTokenCookieOptions())
      .json({ message: "Refresh access token successfully!" })
  }
)

export const verifyEmailController = asyncHandler(
  async (req: Request, res: Response) => {
    const { code } = verificationEmailSchema.parse(req.body);
    await verifyEmailService(code);

    return res.status(HTTPSTATUS.OK).json({
      message: "Email verified successfully!"
    });
  }
);

export const forgotPasswordController = asyncHandler(
  async (req: Request, res: Response) => {
    const email = emailSchema.parse(req.body.email);

    await forgotPasswordService(email);

    // Clear all the cookies.
    return clearAuthenticationCookie(res).status(HTTPSTATUS.OK).json({
      message: "Email sent successfully!"
    })
  }
);

export const resetPasswordController = asyncHandler(
  async (req: Request, res: Response) => {
    const { password, verificationCode } = resetPasswordSchema.parse(req.body);

    await resetPasswordService({ password, verificationCode });

    return res.status(HTTPSTATUS.OK).json({
      message: "Reset password successfully!"
    })
  }
);

export const logOutController = asyncHandler(
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
