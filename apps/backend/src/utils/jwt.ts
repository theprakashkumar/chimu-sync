import jwt, { SignOptions, VerifyOptions } from "jsonwebtoken";
import { UserDocument } from "../models/userModel";
import { appConfig } from "../config/appConfig";
import { SessionDocument } from "../models/sessionModel";

type AccessTokenPayload = {
  sessionId: SessionDocument["_id"]
  userId: UserDocument["_id"];
};

type RefreshTokenPayload = {
  sessionId: SessionDocument["_id"]
}

type MfaTokenPayload = {
  userId: UserDocument["_id"];
}

type SignOptsAndSecret = SignOptions & {
  secret: string;
};

export const accessTokenSignOptions: SignOptsAndSecret = {
  expiresIn: appConfig.JWT_EXPIRES_IN as SignOptions['expiresIn'],
  secret: appConfig.JWT_SECRET,
  audience: ["user"],
};

export const refreshTokenSignOptions: SignOptsAndSecret = {
  expiresIn: appConfig.JWT_REFRESH_EXPIRES_IN as SignOptions['expiresIn'],
  secret: appConfig.JWT_REFRESH_SECRET,
  audience: ["refresh"],
};

export const mfaTokenSignOptions: SignOptsAndSecret = {
  expiresIn: appConfig.MFA_TOKEN_EXPIRES_IN as SignOptions['expiresIn'],
  secret: appConfig.MFA_TOKEN_SECRET,
  audience: ["mfa"],
};

export const signJwtToken = (
  payload: AccessTokenPayload | RefreshTokenPayload | MfaTokenPayload,
  options?: SignOptsAndSecret
) => {
  const { secret, ...opts } = options || accessTokenSignOptions;
  return jwt.sign(payload, secret, {
    ...opts,
  });
};

export const verifyJwtToken = (
  token: string,
  options?: VerifyOptions & { secret: string }
) => {
  try {
    const { secret = appConfig.JWT_SECRET, ...opts } = options || {};
    const payload = jwt.verify(token, secret, {
      ...opts
    })
    return { payload };
  } catch (error: any) {
    return {
      error: error.message
    }
  }

}
