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


type SignOptsAndSecret = SignOptions & {
  secret: string;
};

const defaults: SignOptions = {
  audience: ["user"],
};

const accessTokenSignOptions: SignOptsAndSecret = {
  expiresIn: appConfig.JWT_EXPIRES_IN as SignOptions['expiresIn'],
  secret: appConfig.JWT_SECRET,
};

const refreshTokenSignOptions: SignOptsAndSecret = {
  expiresIn: appConfig.JWT_REFRESH_EXPIRES_IN as SignOptions['expiresIn'],
  secret: appConfig.JWT_REFRESH_SECRET,
};

const signJwtToken = (
  payload: AccessTokenPayload | RefreshTokenPayload,
  options?: SignOptsAndSecret
) => {
  const { secret, ...opts } = options || accessTokenSignOptions;
  return jwt.sign(payload, secret, {
    ...defaults,
    ...opts,
  });
};

const verifyJwtToken = (
  token: string,
  options?: VerifyOptions & { secret: string }
) => {
  try {
    const { secret = appConfig.JWT_SECRET, ...opts } = options || {};
    const payload = jwt.verify(token, secret, {
      ...defaults as VerifyOptions,
      ...opts
    })
    return { payload };
  } catch (error: any) {
    return {
      error: error.message
    }
  }

}

export { accessTokenSignOptions, refreshTokenSignOptions, signJwtToken, verifyJwtToken }