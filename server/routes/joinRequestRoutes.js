import express from 'express';
import { approveJoinRequestController , getAllJoinRequests,getJoinRequestsByUser, getJoinRequestsByCall, createJoinRequest, updateJoinRequest, deleteJoinRequest } from '../controllers/joinRequestController.js';
import { verifyToken } from '../Middleware/authenticate.js';
import { authorizeAdmin,authorizeOwner,authorizeOwnerOrAdmin } from '../Middleware/authorize.js';
import {
  validateJoinRequestIdParam,
  validateCreateJoinRequest,
  validateUpdateJoinRequest,
  validateApproveJoinRequest
} from '../validations/joinRequestValidation.js';
import { handleValidation } from '../Middleware/handleValidation.js';



//רעיון יפיפה של בדיקות הרשאה שהתלבטנו על נכונותו
// const authorizeJoinRequestOwner = authorizeOwner({
//   tableName: 'JOIN_REQUESTS',
//   idField: 'joinRequestId',
//   ownerFields: ['userId'],
//   paramName: 'id'
// });

const authorizeJoinRequestOwnerOrAdmin = authorizeOwnerOrAdmin({
  tableName: 'JOIN_REQUESTS',
  idField: 'joinRequestId',
  ownerFields: ['userId'],
  paramName: 'id'
});
console.log("authorizeJoinRequestOwnerOrAdmin", authorizeJoinRequestOwnerOrAdmin);

const router = express.Router();

// Get all users
router.get('/',verifyToken,authorizeAdmin, getAllJoinRequests);
router.get('/user',verifyToken, getJoinRequestsByUser);
router.get('/byCall/:callId', verifyToken, getJoinRequestsByCall);

//router.get('/',verifyToken, getJoinRequests);
//router.get('/:id', getjoinRequesById);
router.post('/approve', verifyToken,validateCreateJoinRequest, handleValidation,   approveJoinRequestController);
router.post('/',verifyToken,validateCreateJoinRequest, handleValidation,   createJoinRequest);
router.put('/:id',verifyToken, validateUpdateJoinRequest, handleValidation, authorizeJoinRequestOwnerOrAdmin, updateJoinRequest);
router.delete('/:id',verifyToken,validateCreateJoinRequest, handleValidation,  deleteJoinRequest);

export default router;