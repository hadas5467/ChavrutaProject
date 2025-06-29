// validations/chavrutaValidation.js
import { body, param } from 'express-validator';

export const validateChavrutaIdParam = [
  param('id').isInt({ gt: 0 }).withMessage('קוד חברותא חייב להיות מספר חיובי'),
];

export const validateCreateChavruta = [
  body('user1').isInt({ gt: 0 }).withMessage('user1 חייב להיות מספר'),
  body('user2').isInt({ gt: 0 }).withMessage('user2 חייב להיות מספר'),
  body('callId').optional().isInt({ gt: 0 }),
  body('status').optional().isIn(['active', 'pending_start', 'ended']),
  body('notesUser1').optional().isString(),
  body('notesUser2').optional().isString()
];

export const validateUpdateChavruta = [
  ...validateChavrutaIdParam,
  body('user1').optional().isInt({ gt: 0 }),
  body('user2').optional().isInt({ gt: 0 }),
  body('callId').optional().isInt({ gt: 0 }),
  body('status').optional().isIn(['active', 'pending_start', 'ended']),
  body('notesUser1').optional().isString(),
  body('notesUser2').optional().isString()
];
