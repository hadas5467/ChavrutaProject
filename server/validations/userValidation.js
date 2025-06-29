// validations/userValidation.js
import { body, param } from 'express-validator';

// ולידציה ל־:id בפרמטרי URL
export const validateUserIdParam = [
  param('id').isInt({ gt: 0 }).withMessage('קוד משתמש חייב להיות מספר חיובי'),
];

// ולידציה להרשמה
export const validateCreateUser = [
  body('name').isString().notEmpty().withMessage('חובה למלא שם'),
  body('gmail').isEmail().withMessage('כתובת מייל לא תקינה'),
  body('phone').optional().isString(),

  body('age').optional().isIn(['18-25', '25-35', '35-45', '45-60', '60+']),
  body('sector').optional().isIn(['secular', 'traditional', 'religious', 'getting_stronger', 'baal_teshuva', 'haredi']),
  body('contactMethod').optional().isIn(['email', 'whatsapp', 'sms', 'system']),
  body('city').optional().isString(),
  body('country').optional().isString(),
  body('languages').optional().isString(),
  body('bio').optional().isString(),
  body('experienceLevel').optional().isIn(['beginner', 'intermediate', 'advanced', 'expert']),
  body('availability').optional().isObject(),
  body('availabilityStatus').optional().isIn(['available_now', 'open_to_chavruta', 'open_to_lessons', 'not_available']),
  body('tags').optional().isString()
];

// ולידציה לעדכון משתמש
export const validateUpdateUser = [
  ...validateUserIdParam,
  body('name').optional().isString(),
  body('gmail').optional().isEmail(),
  body('phone').optional().isString(),
  body('age').optional().isIn(['18-25', '25-35', '35-45', '45-60', '60+']),
  body('sector').optional().isIn(['secular', 'traditional', 'religious', 'getting_stronger', 'baal_teshuva', 'haredi']),
  body('contactMethod').optional().isIn(['email', 'whatsapp', 'sms', 'system']),
  body('city').optional().isString(),
  body('country').optional().isString(),
  body('languages').optional().isString(),
  body('bio').optional().isString(),
  body('experienceLevel').optional().isIn(['beginner', 'intermediate', 'advanced', 'expert']),
  body('availability').optional().isObject(),
  body('availabilityStatus').optional().isIn(['available_now', 'open_to_chavruta', 'open_to_lessons', 'not_available']),
  body('tags').optional().isString()
];

// ולידציה ללוגאין
export const validateLogin = [
  body('gmail').isEmail().withMessage("יש להזין מייל תקין"),
  body('password').isString().notEmpty().withMessage("יש להזין סיסמה"),
];
