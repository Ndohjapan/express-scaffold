import { body, param, query, ValidationChain } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { ValidationException } from '../../../errors/exceptions/validation';

/**
 * Middleware to handle validation results
 */
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.type === 'field' ? error.path : 'unknown',
      message: error.msg,
      value: error.type === 'field' ? error.value : undefined
    }));

    throw new ValidationException('Validation failed', errorMessages);
  }

  next();
};

/**
 * Wrapper for async validation handlers
 */
export const catchAsync = (handler: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
};

/**
 * Custom validation helper for more complex validations
 */
export const createValidationError = (field: string, message: string, value?: any) => {
  throw new ValidationException('Validation failed', [{ field, message, value }]);
};

/**
 * Common validation rules that can be reused
 */
export const commonValidations = {
  email: () =>
    body('email')
      .isEmail()
      .withMessage('Please provide a valid email address')
      .normalizeEmail()
      .toLowerCase(),

  password: (field: string = 'password') =>
    body(field)
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),

  fullName: () =>
    body('fullName')
      .notEmpty()
      .withMessage('Full name is required')
      .bail()
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Full name must be between 2 and 100 characters')
      .bail()
      .matches(/^[a-zA-Z\s'-]+$/)
      .withMessage('Full name can only contain letters, spaces, hyphens, and apostrophes'),

  objectId: (field: string) =>
    param(field)
      .isMongoId()
      .withMessage(`${field} must be a valid MongoDB ObjectId`),

  status: (allowedStatuses: string[]) =>
    body('status')
      .optional()
      .isIn(allowedStatuses)
      .withMessage(`Status must be one of: ${allowedStatuses.join(', ')}`),

  pagination: () => [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer')
      .toInt(),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100')
      .toInt(),
    query('sort')
      .optional()
      .matches(/^[a-zA-Z_]+(:asc|:desc)?$/)
      .withMessage('Sort format should be field:asc or field:desc')
  ],

  sanitizeInput: (field: string) =>
    body(field)
      .trim()
      .escape(),
};