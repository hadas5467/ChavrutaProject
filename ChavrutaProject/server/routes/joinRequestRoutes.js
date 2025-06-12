import express from 'express';
import { deleteJoinRequest, updateJoinRequest, createJoinRequest, getJoinRequests } from '../controllers/joinRequestController.js';

const router = express.Router();

// Get all users
router.get('/', getJoinRequests);
//router.get('/:id', getjoinRequesById);
router.post('/', createJoinRequest);
router.put('/:id', updateJoinRequest);
router.delete('/:id', deleteJoinRequest);

export default router;