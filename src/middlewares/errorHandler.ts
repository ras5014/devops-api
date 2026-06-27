import type { Request, Response, NextFunction } from "express";
import env from "../config/env.ts";
import logger from "../config/logger.ts";

/*
super(message) calls the parent class constructor and passes message to it.

Most common case in TypeScript/JavaScript:

If your class extends Error, then super(message) runs Error’s constructor.
That sets up built-in error behavior, including the .message property. 
*/

export class AppError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    // Make stack traces clearly identify this custom error type.
    this.name = this.constructor.name;
    // Remove constructor noise from the stack trace.
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (env.APP_STAGE === "dev") {
    logger.error(err.stack);
  }

  // default error
  let status = err.status || 500;
  let message = err.message || "Internal Server Error";

  // Handle specific error types (e.g., validation error, authentication error, etc.)
  if (err.name === "ValidationError") {
    status = 400;
    message = "Validation Error";
  }

  if (err.name === "UnauthorizedError") {
    status = 401;
    message = "Unauthorized";
  }

  res.status(status).json({
    error: message,
    ...(env.APP_STAGE === "dev" && {
      stack: err.stack,
      details: err.message,
    }),
  });
};

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // This is how you create a new error inside app
  // Follow this pattern inside thje entire app to create errors and pass them to the error handler middleware
  const error = new AppError(`Not Found - ${req.originalUrl}`, 404);
  next(error);
};
