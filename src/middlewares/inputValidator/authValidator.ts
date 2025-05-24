import { body } from 'express-validator';
import { commonValidations, handleValidationErrors } from './utils/validationUtils';

/**
 * Validation rules for user signup
 */
export const validateSignup = [
  commonValidations.fullName(),
  
  commonValidations.email(),

  commonValidations.password(),

  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    }),

  // Optional business association during signup
  body('businessId')
    .optional()
    .isMongoId()
    .withMessage('Business ID must be a valid MongoDB ObjectId'),

  handleValidationErrors
];

/**
 * Validation rules for user login
 */
export const validateLogin = [
  commonValidations.email(),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 1 })
    .withMessage('Password cannot be empty'),

  // Optional: Remember me functionality
  body('rememberMe')
    .optional()
    .isBoolean()
    .withMessage('Remember me must be a boolean value'),

  // Security: Validate device info if provided
  body('deviceInfo')
    .optional()
    .isObject()
    .withMessage('Device info must be an object'),

  handleValidationErrors
];

/**
 * Validation rules for password reset request
 */
export const validatePasswordResetRequest = [
  commonValidations.email(),
  handleValidationErrors
];

/**
 * Validation rules for password reset
 */
export const validatePasswordReset = [
  body('token')
    .notEmpty()
    .withMessage('Reset token is required')
    .isLength({ min: 10 })
    .withMessage('Invalid reset token format'),

  commonValidations.password('newPassword'),

  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Password confirmation does not match new password');
      }
      return true;
    }),

  handleValidationErrors
];

/**
 * Validation rules for password change (when user is logged in)
 */
export const validatePasswordChange = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),

  commonValidations.password('newPassword'),

  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Password confirmation does not match new password');
      }
      return true;
    }),

  handleValidationErrors
];

/**
 * Validation rules for email verification
 */
export const validateEmailVerification = [
  body('token')
    .notEmpty()
    .withMessage('Verification token is required')
    .isLength({ min: 10 })
    .withMessage('Invalid verification token format'),

  handleValidationErrors
];