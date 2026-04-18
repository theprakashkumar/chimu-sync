import { CookieOptions, Response } from "express";
import { appConfig } from "../config/appConfig";
import { calculateExpirationDate } from "./dateTime";

interface CookiePayloadType {
  res: Response;
  accessToken: string;
  refreshToken: string;
}

export const REFRESH_PATH = `${appConfig.BASE_PATH}/auth/refresh`;
const MFA_LOGIN_PATH = `${appConfig.BASE_PATH}/mfa/verify-login`

const defaults: CookieOptions = {
  httpOnly: true,
  secure: appConfig.NODE_ENV === "production" ? true : false,
  sameSite: appConfig.NODE_ENV === "production" ? "strict" : "lax"
}

export const getAccessTokenCookieOptions = (): CookieOptions => {
  const expiresIn = appConfig.JWT_EXPIRES_IN;
  const expires = calculateExpirationDate(expiresIn);

  return {
    ...defaults,
    expires,
    path: "/"
  }
}

export const getRefreshTokenCookieOptions = (): CookieOptions => {
  const expiresIn = appConfig.JWT_REFRESH_EXPIRES_IN;
  const expires = calculateExpirationDate(expiresIn);

  return {
    ...defaults,
    expires,
    path: REFRESH_PATH
  }
}

export const getMfaTokenCookieOptions = (): CookieOptions => {
  const expiresIn = appConfig.MFA_TOKEN_EXPIRES_IN;
  const expires = calculateExpirationDate(expiresIn);

  return {
    ...defaults,
    expires,
    path: MFA_LOGIN_PATH
  }
}

export const setAuthenticationCookies = ({
  res, accessToken, refreshToken
}: CookiePayloadType): Response => {
  return res
    .cookie("accessToken", accessToken, getAccessTokenCookieOptions())
    .cookie("refreshToken", refreshToken, getRefreshTokenCookieOptions())
}

export const clearAuthenticationCookie = (res: Response): Response => {
  return res.clearCookie("accessToken").clearCookie("refreshToken", {
    path: REFRESH_PATH
  });
}

export const setMfaTokenCookie = ({ res, mfaChallengeToken }: { res: Response, mfaChallengeToken: string }): Response => {
  return res.cookie("mfaChallengeToken", mfaChallengeToken, getMfaTokenCookieOptions());
}

export const clearMfaTokenCookie = (res: Response): Response => {
  return res
    .clearCookie("mfaChallengeToken", { path: MFA_LOGIN_PATH })
}
