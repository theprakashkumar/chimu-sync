import type { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "../utils/appErrors";

const isAuthenticated = (req: Request, _res: Response, next: NextFunction) => {
  if (!req?.user?._id) {
    throw new UnauthorizedException("Unauthorize, please login.");
  }
  next();
};

export default isAuthenticated;
