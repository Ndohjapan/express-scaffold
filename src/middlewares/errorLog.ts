import { NextFunction, Request, Response } from "express";
import ErrorLogService from "../services/errorLogService";
import rollbar from "../connection/loggingConn";
import en from "../locale/en";

const errorLogService = new ErrorLogService();

export const logError = async (
  error: any,
  req: Request & { user?: { _id: string } },
) => {
  try {
    // Sanitize headers
    const sanitizedHeaders = { ...req.headers };
    delete sanitizedHeaders.authorization;
    delete sanitizedHeaders.cookie;

    // Sanitize body
    const sanitizedBody = { ...req.body };
    const sensitiveFields = ['newPassword', 'oldPassword', 'password'];
    sensitiveFields.forEach(field => {
      if (sanitizedBody[field]) sanitizedBody[field] = '[REDACTED]';
    });

    const errorData = {
      message: error.message || 'Unknown error occurred',
      name: error.name,
      stack: error.stack,
      statusCode: error.statusCode || 500,
      userId: req.user?._id,
      metadata: {
        path: req.path,
        method: req.method,
        correlationId: req.headers['x-correlation-id']
      },
      reqHttpVersion: req.httpVersion,
      reqHeaders: (sanitizedHeaders),
      reqMethod: req.method,
      reqOriginalUrl: req.originalUrl,
      reqParams: JSON.stringify(req.params),
      reqQuery: JSON.stringify(req.query),
      reqBody: sanitizedBody,
      reqIp: req.headers['x-real-ip']?.toString()
    };

    await errorLogService.CreateErrorLog(errorData);
  } catch (loggingError) {
    console.error('Error Logging Middleware Error:', loggingError);
    rollbar.log(loggingError as Error, req, { level: 'error' }, en['database-error-log']);
  }
};
