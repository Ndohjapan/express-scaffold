import { Request, Response, NextFunction } from 'express';
import en from '../locale/en';
import { logError } from "../middlewares/errorLog";
import { ValidationException } from './exceptions/validation';
import { BadRequestException } from './exceptions/badRequest';
import { NotFoundException } from './exceptions/notFound';

// Define interfaces for different error types
interface MongooseValidationError extends Error {
  errors?: Record<string, { path: string; message: string }>;
}

interface MongoError extends Error {
  code?: number;
  keyPattern?: Record<string, any>;
}

interface AppError extends Error {
  status?: number;
  statusCode?: number;
  errors?: Array<{
    path?: string;
    msg?: string;
    message?: string;
  }>;
  validationErrors?: Array<{
    field: string;
    message: string;
    value?: any;
  }>;
}

const errorHandler = async (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let status: number = 500;
  let message: string = err.message;
  let validationErrors: Record<string, string | unknown> | undefined;
  let errorType: string = err.name || 'error';

  // Handle ValidationException specifically
  if (err instanceof ValidationException || err.constructor.name === 'ValidationException') {
    const validationErr = err as ValidationException;
    status = validationErr.statusCode;
    message = validationErr.message;
    errorType = validationErr.name;

    // Convert ValidationException format to response format
    validationErrors = {};
    validationErr.validationErrors.forEach((error) => {
      validationErrors![error.field] = error.message;
    });
  }
  // Handle other custom exceptions
  else if (err instanceof BadRequestException || err.constructor.name === 'BadRequestException') {
    const badReqErr = err as BadRequestException;
    status = badReqErr.statusCode || 400;
    message = badReqErr.message;
    errorType = badReqErr.name;
  }
  else if (err instanceof NotFoundException || err.constructor.name === 'NotFoundException') {
    const notFoundErr = err as NotFoundException;
    status = notFoundErr.statusCode || 404;
    message = notFoundErr.message;
    errorType = notFoundErr.name;
  }
  // Handle Mongoose validation errors
  else if (err.name === 'ValidationError') {
    const mongooseErr = err as MongooseValidationError;
    status = 400;
    message = 'Database validation failed';
    errorType = err.name;
    validationErrors = {};

    if (mongooseErr.errors) {
      Object.values(mongooseErr.errors).forEach((error) => {
        validationErrors![error.path] = error.message;
      });
    }
  }
  // Handle MongoDB duplicate key errors
  else if ((err as MongoError).code === 11000) {
    const mongoErr = err as MongoError;
    status = 400;
    message = 'Duplicate field value';
    errorType = err.name;
    validationErrors = {};

    if (mongoErr.keyPattern) {
      const field = Object.keys(mongoErr.keyPattern)[0];
      if (field) {
        validationErrors[field] = `${field} already exists`;
      }
    }
  }
  // Handle JWT errors
  else if (err.name === 'JsonWebTokenError') {
    status = 401;
    message = 'Invalid token';
    errorType = err.name;
  }
  else if (err.name === 'TokenExpiredError') {
    status = 401;
    message = 'Token expired';
    errorType = err.name;
  }
  // Handle generic AppError
  else {
    const appErr = err as AppError;
    status = appErr.status || appErr.statusCode || 500;
    message = appErr.message;

    if (appErr.validationErrors) {
      validationErrors = {};
      appErr.validationErrors.forEach((error) => {
        validationErrors![error.field] = error.message;
      });
    }
  }

  // Override message for server errors
  if (status >= 500) {
    message = en['server-error'];
  }

  // Log error
  await logError(err, req);

  // Send response
  res.status(status).json({
    status: errorType,
    path: req.originalUrl,
    timestamp: new Date().toISOString(),
    message: message,
    ...(validationErrors && Object.keys(validationErrors).length > 0 && {
      validationErrors
    }),
    // Add additional debug info in development
    ...(process.env.NODE_ENV === 'development' && status >= 500 && {
      stack: err.stack,
      originalError: err.name
    })
  });
};

export default errorHandler;
