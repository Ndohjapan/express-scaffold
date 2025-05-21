import { Request, Response, NextFunction } from 'express';
import en from '../locale/en';
import { logError } from "../middlewares/errorLog";

// Define a custom error interface that includes the properties we're using
interface AppError extends Error {
  status?: number;
  errors?: Array<{
    path?: string;
    msg?: string;
    message?: string;
  }>;
}

const errorHandler = async (
  err: AppError, 
  req: Request, 
  res: Response, 
  // eslint-disable-next-line no-unused-vars
  next: NextFunction
) => {
  let { status, message, errors } = err;
  status = status ? status : 500;
  let validation_errors: Record<string, string | unknown> | undefined;
  
  if (errors) {
    validation_errors = {};
    errors.forEach((error) => {
      if (error.msg || error.message) {
        validation_errors![error.path || 'file'] = error.msg || error.message;
      } else {
        validation_errors![error.path || 'row'] = error;
      }
    });
  }
  
  if (status > 499) {
    message = en['server-error'];
  }

  await logError(err, req);

  res.status(status).send({
    status: 'error',
    path: req.originalUrl,
    timestamp: new Date().getTime(),
    message: message,
    validation_errors,
  });
};


export default errorHandler;