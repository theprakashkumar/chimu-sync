import { Request, Response, NextFunction } from "express";

type AsyncControllerType = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

export const asyncHandler = (
  controller: AsyncControllerType
): AsyncControllerType => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await controller(req, res, next);
    } catch (error) {
      // ? Pass the error to the next middleware which will be handled by the `errorHandler` middleware in our case.
      next(error);
    }
  };
};
