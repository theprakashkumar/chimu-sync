import { Request, Response, NextFunction } from "express";
import { UnauthorizedException } from "../utils/appErrors";
import { verifyJwtToken } from "../utils/jwt";
import UserModel from "../models/userModel";
import { asyncHandler } from "./asyncHandlerMiddleware";

type AccessTokenPayload = {
  userId: string;
  sessionId: string;
};

const authenticateJwtHandler = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const accessToken = req.cookies?.accessToken;
  if (!accessToken) {
    throw new UnauthorizedException("User is not authorized!");
  }

  const result = verifyJwtToken(accessToken);
  if ("error" in result) {
    throw new UnauthorizedException("User is not authorized!");
  }

  const { userId, sessionId } = result.payload as AccessTokenPayload;
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new UnauthorizedException("User is not authorized!");
  }

  req.sessionId = sessionId;
  req.user = user;
  next();
};

export const authenticatedJwt = asyncHandler(authenticateJwtHandler);