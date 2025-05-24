import { Request, Response, NextFunction, RequestHandler } from 'express';

type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

/**
 * catchAsync is a middleware function that handles promise rejections in async route handlers.
 *
 * It takes in a route handler function as a parameter and returns a new wrapped function.
 *
 * Inside the wrapped function, it calls the route handler while catching any errors.
 * If there is a rejected promise, it will call next() to pass the error to the global error handler.
 *
 * This avoids having to wrap each route handler in a try/catch block to handle errors.
 * It cleans up the code and provides a consistent way to handle errors in async route handlers.
 *
 * Usage:
 *
 * const handler = catchAsync(async (req: Request, res: Response) => {
 *   // do something that could reject
 * });
 *
 * app.get('/api', handler);
 */
const catchAsync = (handler: AsyncRequestHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
};

export default catchAsync;
