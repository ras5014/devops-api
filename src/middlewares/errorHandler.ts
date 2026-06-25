import { Request, Response, NextFunction } from "express";
import env from "../../config/env.ts";

export class AppError extends Error {
  // HTTP status code to send back to the client.
  status: number;

  constructor(message: string, status: number) {
    super(message);
    // Preserve the response status alongside the error message.
    this.status = status;
    // Make stack traces clearly identify this custom error type.
    this.name = this.constructor.name;
    // Remove constructor noise from the stack trace.
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = 