import { body, param } from 'express-validator';
import { commonValidations, handleValidationErrors } from './utils/validationUtils';
import { AccountModel } from '../../database/models/Account';

/**
 * Validation rules for updating account profile
 */
export const validateUpdateProfile = [
  commonValidations.fullName(),

  body('email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
    .toLowerCase()
    .custom(async (email, { req }) => {
      if (email) {
        const existingUser = await AccountModel.findOne({ 
          email, 
          _id: { $ne: req.user?.id } 
        });
        if (existingUser) {
          throw new Error('Email already exists');
        }
      }
      return true;
    }),

  handleValidationErrors
];

/**
 * Validation rules for account status updates (admin only)
 */
export const validateAccountStatusUpdate = [
  commonValidations.objectId('accountId'),
  
  commonValidations.status(['active', 'suspended', 'deleted']),

  body('reason')
    .optional()
    .isLength({ min: 10, max: 500 })
    .withMessage('Reason must be between 10 and 500 characters'),

  handleValidationErrors
];

/**
 * Validation rules for business association
 */
export const validateBusinessAssociation = [
  commonValidations.objectId('accountId'),
  
  body('businessIds')
    .isArray({ min: 1 })
    .withMessage('At least one business ID is required')
    .custom((businessIds) => {
      return businessIds.every((id: string) => /^[0-9a-fA-F]{24}$/.test(id));
    })
    .withMessage('All business IDs must be valid MongoDB ObjectIds'),

  handleValidationErrors
];

/**
 * Validation rules for getting account by ID
 */
export const validateGetAccount = [
  commonValidations.objectId('accountId'),
  handleValidationErrors
];

/**
 * Validation rules for account listing with pagination and filtering
 */
export const validateAccountListing = [
  ...commonValidations.pagination(),

  body('status')
    .optional()
    .isIn(['active', 'suspended', 'deleted'])
    .withMessage('Status must be active, suspended, or deleted'),

  body('search')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Search term must be between 2 and 100 characters')
    .matches(/^[a-zA-Z0-9\s@.-]+$/)
    .withMessage('Search term contains invalid characters'),

  handleValidationErrors
];