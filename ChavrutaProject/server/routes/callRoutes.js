import express from 'express';
import { getCalls, createCall, updateCall, deleteCall } from '../controllers/callController.js';
import { verifyToken } from '../middlewares/authenticate.js';
import { authorizeAdmin,authorizeOwner,authorizeOwnerOrAdmin } from '../Middleware/authorize.js';
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
router.put('/:id', verifyToken, authorizeCallOwner, updateCall);
router.delete('/:id', verifyToken, authorizeCallOwnerOrAdmin, deleteCall);

export default router;
