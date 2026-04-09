import { CookieOptions, Response } from "express";
import { appConfig } from "../config/appConfig";
import { calculateExpirationDate } from "./dateTime";

interface CookiePayloadType {
  res: Response;
  accessToken: string;
  refreshToken: string;
}

const REFRESH_PATH = `${appConfig.BASE_PATH}/auth/refresh`;

const defaults: CookieOptions = {
  httpOnly: true,
  secure: appConfig.NODE_ENV === "production" ? true : false,
  sameSite: appConfig.NODE_ENV === "production" ? "strict" : "lax"
}

const getAccessTokenCookieOptions = (): CookieOptions => {
  const expiresIn = appConfig.JWT_EXPIRES_IN;
  const expires = calculateExpirationDate(expiresIn);

  return {
    ...defaults,
    expires,
    path: "/"
  }
}

const getRefreshTokenCookieOptions = (): CookieOptions => {
  const expiresIn = appConfig.JWT_REFRESH_EXPIRES_IN;
  const expires = calculateExpirationDate(expiresIn);

  return {
    ...defaults,
    expires,
    path: REFRESH_PATH
  }
}

const setAuthenticationCookies = ({
  res, accessToken, refreshToken
}: CookiePayloadType): Response => {
  return res
    .cookie("accessToken", accessToken, getAccessTokenCookieOptions())
    .cookie("refreshToken", refreshToken, getRefreshTokenCookieOptions())
}

const clearAuthenticationCookie = (res: Response): Response => {
  return res.clearCookie("accessToken").clearCookie("refreshToken", {
    path: REFRESH_PATH
  })
}

export {
  REFRESH_PATH,
  getAccessTokenCookieOptions,
  getRefreshTokenCookieOptions,
  setAuthenticationCookies,
  clearAuthenticationCookie
};