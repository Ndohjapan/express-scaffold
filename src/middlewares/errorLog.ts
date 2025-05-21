import rollbar from '../connection/loggingConn';
import en from '../locale/en';
import ErrorLogService from '../services/errorLogService';

const service = new ErrorLogService();

/**
 * Logs error information to the database
 *
 * @param {Object} error - The error object containing details about the error
 * @param {Object} req - The request object containing details about the request
 */

export const logError = async (error: Error & { event?: string; source?: string; data?: any }, req: {
  body?: any;
  headers?: any;
  httpVersion?: string;
  method?: string;
  originalUrl?: string;
  params?: any;
  query?: any;
  user?: { _id: string };
}) => {
  try {
    // Sanitize sensitive request data before logging

    if (req.body) {
      // Remove password fields from request body
      Object.prototype.hasOwnProperty.call(req.body, 'new_password')
        ? (req.body.new_password = 'string')
        : {};

      Object.prototype.hasOwnProperty.call(req.body, 'old_password')
        ? (req.body.old_password = 'string')
        : {};

      Object.prototype.hasOwnProperty.call(req.body, 'password')
        ? (req.body.password = 'string')
        : {};
    }

    if (req.headers) {
      // Remove authorization and cookie headers
      Object.prototype.hasOwnProperty.call(req.headers, 'authorization')
        ? delete req.headers.authorization
        : {};

      Object.prototype.hasOwnProperty.call(req.headers, 'cookie')
        ? delete req.headers.cookie
        : {};
    }

    // Construct error log object
    const error_data = {
      error: JSON.stringify(error),
      error_message: error.message,
      event: error.event,
      source: error.source,
      data: error.data,
      error_name: error.name,
      error_stack: error.stack,
      req_http_version: req.httpVersion,
      req_headers: req.headers,
      req_method: req.method,
      req_original_url: req.originalUrl,
      req_params: req.params,
      req_query: req.query,
      req_body: req.body,
      ...(req.headers ? { req_ip: req.headers['x-real-ip'] } : {}),
      ...(req.user ? { user_id: req.user._id } : {}),
    };

    // Save error log to database
    await service.CreateErrorLog(error_data);
  } catch (err) {
    // Log error to Rollbar
    if (err instanceof Error) {
      rollbar.log(err, req, { level: 'error' }, en['database-error-log']);
      console.log(err);
    }
    return;
  }
};