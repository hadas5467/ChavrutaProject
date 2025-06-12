import express from 'express';
import { getCalls, createCall, updateCall, deleteCall } from '../controllers/callController.js';

const router = express.Router();

router.get('/', getCalls);
//router.get('/:id', getCallById);
router.post('/', createCall);
router.put('/:id', updateCall);
router.delete('/:id', deleteCall);

export default router;
