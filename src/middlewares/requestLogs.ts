import { NextFunction, Request, Response } from "express";
import rollbar from "../connection/loggingConn";
import en from "../locale/en";
import RequestLogService from "../services/requestLogService";

const service = new RequestLogService();

export const logRequest = async (req: Request & { user?: { _id: string } }, res: Response) => {
  /**
   * Mask sensitive data in request body
   */
  if (req.body) {
    if (Object.prototype.hasOwnProperty.call(req.body, 'newPassword')) {
      req.body.new_password = 'string';
    }
    if (Object.prototype.hasOwnProperty.call(req.body, 'oldPassword')) {
      req.body.old_password = 'string';
    }
    if (Object.prototype.hasOwnProperty.call(req.body, 'password')) {
      req.body.password = 'string';
    }
  }

  /**
   * Remove sensitive headers
   */
  if (req.headers) {
    if (Object.prototype.hasOwnProperty.call(req.headers, 'authorization')) {
      delete req.headers.authorization;
    }
    if (Object.prototype.hasOwnProperty.call(req.headers, 'cookie')) {
      delete req.headers.cookie;
    }
  }

  /**
   * Construct request data object
   */
  const request_data = {
    req_http_version: req.httpVersion,
    req_headers: req.headers,
    req_method: req.method,
    req_original_url: req.originalUrl,
    req_params: req.params,
    req_query: req.query,
    req_body: req.body,
    ...(req.headers ? { req_ip: req.headers['x-real-ip'] } : {}),
    res_status: res.statusCode,
    ...(req.user ? { user_id: req.user._id } : {}),
  };

  /**
   * Save request log
   */
  try {
    await service.CreateRequestLog(request_data);
  } catch (error) {
    rollbar.log(error as Error, req, { level: 'error' }, en['database-request-log']);

    console.log(error);
  }
};

export const logRequestAtStart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await logRequest(req, res);
    return next();
  } catch (error) {
    rollbar.log(error as Error, req, { level: 'error' }, en['database-request-log']);
    console.log(error);
    return next();
  }
};
