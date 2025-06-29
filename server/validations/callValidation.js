// validations/callValidation.js
import { body, param } from 'express-validator';

export const validateCallIdParam = [
  param('id').isInt({ gt: 0 }).withMessage('callId חייב להיות מספר חיובי'),
];

export const validateCreateCall = [
  body('userId').isInt({ gt: 0 }).withMessage('userId נדרש'),
  body('targetUserId').optional().isInt({ gt: 0 }),
  body('place').optional().isString(),
  body('learningFormat').isIn(['zoom', 'phone', 'face_to_face', 'any']),
  body('time').isISO8601().withMessage('זמן לא תקין'),
  body('subject').isString().notEmpty().withMessage('נושא נדרש'),
  body('ageRange').optional().isIn(['18-25', '25-35', '35-45', '45-60', '60+']),
  body('notes').optional().isString(),
  body('preferredDuration').optional().isIn(['10-20_min', '30_min', '45_min', '1_hour', '1_hour+', 'flexible']),
  body('material').optional().isString(),
  body('isActive').optional().isBoolean()
];

export const validateUpdateCall = [
  ...validateCallIdParam,
  body('userId').optional().isInt({ gt: 0 }),
  body('targetUserId').optional().isInt({ gt: 0 }),
  body('place').optional().isString(),
  body('learningFormat').optional().isIn(['zoom', 'phone', 'face_to_face', 'any']),
  body('time').optional().isISO8601(),
  body('subject').optional().isString(),
  body('ageRange').optional().isIn(['18-25', '25-35', '35-45', '45-60', '60+']),
  body('notes').optional().isString(),
  body('preferredDuration').optional().isIn(['10-20_min', '30_min', '45_min', '1_hour', '1_hour+', 'flexible']),
  body('material').optional().isString(),
  body('isActive').optional().isBoolean()
];
