import { NextFunction, Request, Response } from "express";
import rollbar from "../connection/loggingConn";
import en from "../locale/en";
import RequestLogService from "../services/requestLogService";

const service = new RequestLogService();

export const logRequest = async (req: Request & { user?: { _id: string } }, res: Response) => {
  try {
    // Mask sensitive data
    const sanitizedBody = { ...req.body };
    const sensitiveFields = ['newPassword', 'oldPassword', 'password'];
    sensitiveFields.forEach(field => {
      if (sanitizedBody[field]) sanitizedBody[field] = 'string';
    });

    // Remove sensitive headers
    const sanitizedHeaders = { ...req.headers };
    delete sanitizedHeaders.authorization;
    delete sanitizedHeaders.cookie;

    // Construct request data
    const request_data = {
      reqHttpVersion: req.httpVersion,
      reqHeaders: sanitizedHeaders,
      reqMethod: req.method,
      reqOriginalUrl: req.originalUrl,
      reqParams: JSON.stringify(req.params),
      reqQuery: JSON.stringify(req.query),
      reqBody: sanitizedBody,
      statusCode: res.statusCode,
      reqIp: req.headers['x-real-ip']?.toString(),
      userId: req.user?._id
    };

    await service.CreateRequestLog(request_data);
  } catch (error) {
    console.error('Request Logging Middleware Error:', error);
    rollbar.log(error as Error, req, { level: 'error' }, en['database-request-log']);
  }
};

export const logRequestAtStart = async (
  req: Request & { user?: { _id: string } }, 
  res: Response, 
  next: NextFunction
) => {
  try {
    await logRequest(req, res);
  } catch (error) {
    console.error('Request Logging Middleware Error:', error);
    rollbar.log(error as Error, req, { level: 'error' }, en['database-request-log']);
  }
  next();
};
