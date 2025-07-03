import { ErrorRequestHandler } from "express";
import { Request, Response, NextFunction } from "express";
import { HTTPSTATUS } from "../config/httpConfig";

export const errorHandler: ErrorRequestHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  if (error instanceof SyntaxError) {
    return res.status(HTTPSTATUS.BAD_REQUEST).json({
      message: "Invalid JSON format. Please check request body",
    });
  }
  return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
    message: "Internal server error",
    error: error?.message || "Unknown error occurred.",
  });
};
