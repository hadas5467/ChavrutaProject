import express from 'express';
import { getChavrutas, createChavruta, updateChavruta, deleteChavruta } from '../controllers/chavrutaController.js';
const router = express.Router();

// Get all users
router.get('/', getChavrutas);
//router.get('/:id', getCavrutaById);
router.post('/', createChavruta);
router.put('/:id', updateChavruta);
router.delete('/:id', deleteChavruta);

export default router;