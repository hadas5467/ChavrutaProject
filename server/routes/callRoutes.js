import express from 'express';
import { getCalls, createCall, updateCall, deleteCall } from '../controllers/callController.js';
import { verifyToken } from '../Middleware/authenticate.js';
import { authorizeAdmin,authorizeOwner,authorizeOwnerOrAdmin } from '../Middleware/authorize.js';
import {
  validateCallIdParam,
  validateCreateCall,
  validateUpdateCall
} from '../validations/callValidation.js';
import { handleValidation } from '../Middleware/handleValidation.js';



const router = express.Router();

router.get('/', verifyToken, getCalls);
router.post('/', verifyToken, createCall);
router.put('/:id', verifyToken,validateCreateCall, handleValidation, updateCall);
router.delete('/:id', verifyToken,validateCreateCall, handleValidation, authorizeAdmin, deleteCall);

export default router;
//  Something nice we debated about its correctness
// const authorizeCallOwner = authorizeOwner({
//   tableName: 'CALLS',
//   idField: 'callId',
//   ownerFields: ['userId'],
//   paramName: 'id'
// });

// const authorizeCallOwnerOrAdmin = authorizeOwnerOrAdmin({
//   tableName: 'CALLS',
//   idField: 'callId',
//   ownerFields: ['userId'],
//   paramName: 'id'
// });