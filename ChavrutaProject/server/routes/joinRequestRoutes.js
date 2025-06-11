import express from 'express';
import { getAlljoinRequest, getjoinRequesById, createjoinReques, updatejoinReques, deletejoinReques } from '../controllers/joinRequesController.js';

const router = express.Router();

// Get all users
router.get('/', getAlljoinRequest);
router.get('/:id', getjoinRequesById);
router.post('/', createjoinReques);
router.put('/:id', updatejoinReques);
router.delete('/:id', deletejoinReques);

export default router;