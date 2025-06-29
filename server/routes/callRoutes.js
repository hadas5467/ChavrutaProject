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


const authorizeCallOwner = authorizeOwner({
  tableName: 'CALLS',
  idField: 'callId',
  ownerFields: ['userId'],
  paramName: 'id'
});

const authorizeCallOwnerOrAdmin = authorizeOwnerOrAdmin({
  tableName: 'CALLS',
  idField: 'callId',
  ownerFields: ['userId'],
  paramName: 'id'
});
const router = express.Router();

router.get('/', verifyToken, getCalls);
//router.get('/:id', getCallById);
router.post('/', verifyToken, createCall);
router.put('/:id', verifyToken,validateCreateCall, handleValidation, authorizeCallOwner, updateCall);
router.delete('/:id', verifyToken,validateCreateCall, handleValidation, authorizeCallOwnerOrAdmin, deleteCall);

export default router;
