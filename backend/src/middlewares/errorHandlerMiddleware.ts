import { ErrorRequestHandler } from "express";
import { Request, Response, NextFunction } from "express";
import { HTTPSTATUS } from "../config/httpConfig";
import { AppError } from "../utils/appErrors";
import { ZodError } from "zod";
import { ErrorCodeEnum } from "../enums/errorCodeEnum";

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

  // Error handling for Zod validation error.
  if (error instanceof ZodError) {
    const errors = error?.issues?.map((error) => ({
      field: error.path.join("."),
      message: error.message,
    }));

    return res.status(HTTPSTATUS.BAD_REQUEST).json({
      message: "Validation error!",
      error: errors,
      errorCode: ErrorCodeEnum.VALIDATION_ERROR,
    });
  }
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      message: error.message,
      errorCode: error.errorCode,
    });
  }

  return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
    message: "Internal server error",
    error: error?.message || "Unknown error occurred.",
  });
};
