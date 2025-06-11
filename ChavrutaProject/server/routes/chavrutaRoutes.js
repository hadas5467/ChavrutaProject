import express from 'express';
import { getAllCavrutas, getCavrutaById, createCavruta, updateCavruta, deleteCavruta } from '../controllers/CavrutaController.js';

const router = express.Router();

// Get all users
router.get('/', getAllCavrutas);
router.get('/:id', getCavrutaById);
router.post('/', createCavruta);
router.put('/:id', updateCavruta);
router.delete('/:id', deleteCavruta);

export default router;