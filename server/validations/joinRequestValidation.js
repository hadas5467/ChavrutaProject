import { body, param } from 'express-validator';

// ולידציה על :id מה-URL
export const validateJoinRequestIdParam = [
  param('id').isInt({ gt: 0 }).withMessage('joinRequestId חייב להיות מספר חיובי')
];

// ולידציה ליצירת בקשה
export const validateCreateJoinRequest = [
  body('callId').isInt({ gt: 0 }).withMessage('callId נדרש'),
  body('userId').isInt({ gt: 0 }).withMessage('userId נדרש'),
  body('targetUserId').isInt({ gt: 0 }).withMessage('targetUserId נדרש'),
  body('details').optional().isString(),
  body('status').optional().isIn(['pending', 'approved', 'declined']),
];

// ולידציה לעדכון בקשה
export const validateUpdateJoinRequest = [
  ...validateJoinRequestIdParam,
  body('callId').optional().isInt({ gt: 0 }),
  body('userId').optional().isInt({ gt: 0 }),
  body('details').optional().isString(),
  body('status').optional().isIn(['pending', 'approved', 'declined']),
];

// ולידציה לאישור בקשה
export const validateApproveJoinRequest = [
  body('user1').isInt({ gt: 0 }).withMessage('user1 נדרש'),
  body('user2').isInt({ gt: 0 }).withMessage('user2 נדרש'),
  body('callId').isInt({ gt: 0 }).withMessage('callId נדרש'),
];
