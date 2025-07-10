import { Request, Response, NextFunction } from "express";
import { UnauthorizedException } from "../utils/appErrors";

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || !req.user._id) {
    throw new UnauthorizedException("Unauthorize, please login.");
  }
  next();
};

export default isAuthenticated;
