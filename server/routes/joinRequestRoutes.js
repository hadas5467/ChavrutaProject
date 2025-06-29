import express from 'express';
import { approveJoinRequestController , getAllJoinRequests,getJoinRequestsByUser, getJoinRequestsByCall, createJoinRequest, updateJoinRequest, deleteJoinRequest } from '../controllers/joinRequestController.js';
import { verifyToken } from '../Middleware/authenticate.js';
import { authorizeAdmin } from '../Middleware/authorize.js';
import {
  validateJoinRequestIdParam,
  validateCreateJoinRequest,
  validateUpdateJoinRequest,
  validateApproveJoinRequest
} from '../validations/joinRequestValidation.js';
import { handleValidation } from '../Middleware/handleValidation.js';


const router = express.Router();


router.get('/',verifyToken,authorizeAdmin, getAllJoinRequests);
router.get('/user',verifyToken, getJoinRequestsByUser);
router.get('/byCall/:callId', verifyToken, getJoinRequestsByCall);
router.post('/approve', verifyToken,validateCreateJoinRequest, handleValidation,   approveJoinRequestController);
router.post('/',verifyToken,validateCreateJoinRequest, handleValidation,   createJoinRequest);
router.put('/:id',verifyToken, validateUpdateJoinRequest, handleValidation, authorizeAdmin, updateJoinRequest);
router.delete('/:id',verifyToken,validateCreateJoinRequest, handleValidation,  deleteJoinRequest);

export default router;

//רעיון יפיפה של בדיקות הרשאה שהתלבטנו על נכונותו
// const authorizeJoinRequestOwner = authorizeOwner({
//   tableName: 'JOIN_REQUESTS',
//   idField: 'joinRequestId',
//   ownerFields: ['userId'],
//   paramName: 'id'
// });

// const authorizeJoinRequestOwnerOrAdmin = authorizeOwnerOrAdmin({
//   tableName: 'JOIN_REQUESTS',
//   idField: 'joinRequestId',
//   ownerFields: ['userId'],
//   paramName: 'id'
// });
// console.log("authorizeJoinRequestOwnerOrAdmin", authorizeJoinRequestOwnerOrAdmin);