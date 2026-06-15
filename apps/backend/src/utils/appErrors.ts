import { HTTPSTATUS, HttpStatusCodeType } from "../config/httpConfig";
import { ErrorCodeEnum, ErrorCodeEnumType } from "../enums/errorCodeEnum";

export class AppError extends Error {
  public statusCode: HttpStatusCodeType;
  public errorCode?: ErrorCodeEnumType;

  constructor(
    message: string,
    statusCode: HttpStatusCodeType = HTTPSTATUS.INTERNAL_SERVER_ERROR,
    errorCode?: ErrorCodeEnumType
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    // ? When something goes wrong, a stack trace is a list of “who called whom” so you can see where the error really started. When you use a custom error class(AppError), Node would normally include boring lines like “inside the AppError constructor” at the top. That doesn’t help you fix the bug. 
    // ? `Error.captureStackTrace(this, this.constructor)` says: “Build the stack for this error, but skip the constructor boilerplate so the first useful line is who actually threw / created the error.” Example:
    // ```javascript
    // function saveUser() {
    //   throw new AppError("Save failed", 500);
    // }
    // saveUser();
    // ```
    // ? Without captureStackTrace, error.stack might look like:
    // ```javascript
    // AppError: Save failed
    //     at new AppError (appErrors.ts:13:5)   ← noise: “we’re inside the error class”
    //     at saveUser (users.ts:2:9)            ← what you actually care about
    // ? With captureStackTrace(this, this.constructor), it’s more like:
    // ```javascript
    // AppError: Save failed
    //     at saveUser (users.ts:2:9)             ← starts where the problem is for you
    // ```
    // ? It cleans up the stack so debugging points at your code(e.g. saveUser), not at the error class’s constructor.
    // ? Analogy: The stack is a breadcrumb trail. The constructor is the factory that printed the “Out of order” sticker. You care about which aisle the problem happened in, not which sticker machine was used. captureStackTrace hides the factory step and leaves the trail starting at the aisle.
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Represents a generic HTTP exception.
 *
 * @extends AppError
 *
 * @param {string} [message="HTTP exception error"] - Error message.
 * @param {HttpStatusCodeType} statusCode - HTTP status code to be sent in response.
 * @param {ErrorCodeEnumType} errorCode - Application-specific error code.
 *
 * @example
 * // Throw with custom message, status, and error code
 * throw new HttpException("Invalid data", HTTPSTATUS.BAD_REQUEST, ErrorCodeEnum.VALIDATION_ERROR);
 *
 * // Example output
 * // {
 * //   "message": "Invalid data",
 * //   "statusCode": 400,
 * //   "errorCode": "VALIDATION_ERROR"
 * // }
 */
export class HttpException extends AppError {
  constructor(
    message = "HTTP exception error",
    statusCode: HttpStatusCodeType,
    errorCode: ErrorCodeEnumType
  ) {
    super(message, statusCode, errorCode);
  }
}

/**
 * Exception for internal server errors (HTTP 500).
 *
 * @extends AppError
 *
 * @param {string} [message="Internal Server Error"] - Error message.
 * @param {ErrorCodeEnumType} [errorCode] - Application-specific error code.
 *
 * @example
 * // Throw an internal server error
 * throw new InternalServerException("Unexpected failure");
 *
 * // Example output
 * // {
 * //   "message": "Unexpected failure",
 * //   "statusCode": 500,
 * //   "errorCode": "INTERNAL_SERVER_ERROR"
 * // }
 */
export class InternalServerException extends AppError {
  constructor(
    message = "Internal Server Error",
    errorCode?: ErrorCodeEnumType
  ) {
    super(
      message,
      HTTPSTATUS.INTERNAL_SERVER_ERROR,
      errorCode || ErrorCodeEnum.INTERNAL_SERVER_ERROR
    );
  }
}

/**
 * Exception for not found resources (HTTP 404).
 *
 * @extends AppError
 *
 * @param {string} [message="Resource not found"] - Error message.
 * @param {ErrorCodeEnumType} [errorCode] - Application-specific error code.
 *
 * @example
 * // Throw not found for missing user
 * throw new NotFoundException("User does not exist");
 *
 * // Example output
 * // {
 * //   "message": "User does not exist",
 * //   "statusCode": 404,
 * //   "errorCode": "RESOURCE_NOT_FOUND"
 * // }
 */
export class NotFoundException extends AppError {
  constructor(message = "Resource not found", errorCode?: ErrorCodeEnumType) {
    super(
      message,
      HTTPSTATUS.NOT_FOUND,
      errorCode || ErrorCodeEnum.RESOURCE_NOT_FOUND
    );
  }
}

/**
 * Exception for bad requests (HTTP 400), typically validation errors.
 *
 * @extends AppError
 *
 * @param {string} [message="Bad Request"] - Error message.
 * @param {ErrorCodeEnumType} [errorCode] - Application-specific error code.
 *
 * @example
 * // Throw on invalid payload
 * throw new BadRequestException("Missing required field");
 *
 * // Example output
 * // {
 * //   "message": "Missing required field",
 * //   "statusCode": 400,
 * //   "errorCode": "VALIDATION_ERROR"
 * // }
 */
export class BadRequestException extends AppError {
  constructor(message = "Bad Request", errorCode?: ErrorCodeEnumType) {
    super(
      message,
      HTTPSTATUS.BAD_REQUEST,
      errorCode || ErrorCodeEnum.VALIDATION_ERROR
    );
  }
}

/**
 * Exception for unauthorized access (HTTP 401).
 *
 * @extends AppError
 *
 * @param {string} [message="Unauthorized Access"] - Error message.
 * @param {ErrorCodeEnumType} [errorCode] - Application-specific error code.
 *
 * @example
 * // Throw for missing or invalid token
 * throw new UnauthorizedException("Invalid token");
 *
 * // Example output
 * // {
 * //   "message": "Invalid token",
 * //   "statusCode": 401,
 * //   "errorCode": "ACCESS_UNAUTHORIZED"
 * // }
 */
export class UnauthorizedException extends AppError {
  constructor(message = "Unauthorized Access", errorCode?: ErrorCodeEnumType) {
    super(
      message,
      HTTPSTATUS.UNAUTHORIZED,
      errorCode || ErrorCodeEnum.ACCESS_UNAUTHORIZED
    );
  }
}
