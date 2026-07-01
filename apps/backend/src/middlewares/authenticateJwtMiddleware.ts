import type { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import SessionModel from "../models/sessionModel";
import { UnauthorizedException } from "../utils/appErrors";
import { accessTokenSignOptions, verifyJwtToken } from "../utils/jwt";
import { asyncHandler } from "./asyncHandlerMiddleware";

type AccessTokenPayload = {
  userId: string;
  sessionId: string;
};

const authenticateJwtHandler = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const accessToken = req.cookies?.accessToken;
  if (!accessToken) {
    throw new UnauthorizedException("User is not authorized!");
  }

  const result = verifyJwtToken(accessToken, {
    secret: accessTokenSignOptions.secret,
    audience: ["user"],
  });
  if ("error" in result) {
    throw new UnauthorizedException("User is not authorized!");
  }

  const { userId, sessionId } = result.payload as AccessTokenPayload;

  if (!userId || !sessionId) {
    throw new UnauthorizedException("User is not authorized!");
  }

  const session = await SessionModel.findOne({
    _id: sessionId,
    userId: userId,
    expiredAt: { $gt: new Date() },
  }).populate("userId");

  if (!session) {
    throw new UnauthorizedException("User is not authorized!");
  }

  const user = session.userId;
  if (!user || user instanceof mongoose.Types.ObjectId) {
    throw new UnauthorizedException("User is not authorized!");
  }
  req.sessionId = sessionId;
  req.user = user;
  next();
};

export const authenticatedJwt = asyncHandler(authenticateJwtHandler);
