import { ErrorRequestHandler } from "express";
import { Request, Response, NextFunction } from "express";
import { HTTPSTATUS } from "../config/httpConfig";
import { AppError } from "../utils/appErrors";
import { ZodError } from "zod";
import { ErrorCodeEnum } from "../enums/errorCodeEnum";
import { clearAuthenticationCookie, REFRESH_PATH } from "../utils/cookie";

/**
 * Express error handling middleware.
 *
 * This middleware centralizes error handling for the application, handling:
 * - SyntaxError (invalid JSON)
 * - Zod validation errors (from schema validation)
 * - Custom AppError (application-defined errors)
 * - Any other errors as generic internal server errors
 *
 * Responds with appropriate HTTP status codes and error messages/structures.
 * 
 * @param {any} error - The error object thrown in the request lifecycle.
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next middleware function.
 * @returns {Response} Express response with error details.
 *
 * @example
 * // Usage as the last middleware in Express app:
 * import { errorHandler } from './middlewares/errorHandlerMiddleware';
 * app.use(errorHandler);
 *
 * // Example: Handling ZodError in a controller
 * import { z } from "zod";
 * const schema = z.object({ username: z.string() });
 * app.post('/register', (req, res, next) => {
 *   try {
 *     schema.parse(req.body);
 *     // ... do registration
 *     res.send('Registered!');
 *   } catch (err) {
 *     next(err);
 *   }
 * });
 */
export const errorHandler: ErrorRequestHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  // If path is for refresh token then clear cookies. 
  if (req.path === REFRESH_PATH) {
    clearAuthenticationCookie(res);
  }

  // ? Error handling for JSON syntax error.
  if (error instanceof SyntaxError) {
    return res.status(HTTPSTATUS.BAD_REQUEST).json({
      message: "Invalid JSON format. Please check request body",
    });
  }

  // ? Error handling for Zod validation error.
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

  // ? Default: Internal server error
  return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
    message: "Internal server error",
    error: error?.message || "Unknown error occurred.",
  });
};
