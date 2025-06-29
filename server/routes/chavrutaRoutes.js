import express from 'express';
import { updateChavruta, getAllChavrutas, createChavruta, deleteChavruta, getChavrutasByUser } from '../controllers/ChavrutaController.js';
import {verifyToken} from '../Middleware/authenticate.js';
import { authorizeAdmin,authorizeOwner,authorizeOwnerOrAdmin } from '../Middleware/authorize.js';
import {
  validateChavrutaIdParam,
  validateCreateChavruta,
  validateUpdateChavruta
} from '../validations/chavrutaValidation.js';
import { handleValidationChavruta } from '../Middleware/handleValidationChavruta.js';


const router = express.Router();
const authorizeChavrutaOwner = authorizeOwner({
  tableName: 'CHAVRUTA',
  idField: 'chavrutaId',
  ownerFields: ['user1', 'user2'],
  paramName: 'id'
});

const authorizeChavrutaOwnerOrAdmin = authorizeOwnerOrAdmin({
  tableName: 'CHAVRUTA',
  idField: 'chavrutaId',
  ownerFields: ['user1', 'user2'],
  paramName: 'id'
});

// ב־routes
router.put('/chavruta/:id', verifyToken, authorizeChavrutaOwner, updateChavruta);
router.delete('/chavruta/:id', verifyToken, authorizeChavrutaOwnerOrAdmin, deleteChavruta);

// Get all 
router.get('/', verifyToken,authorizeAdmin, getAllChavrutas);
router.get('/user/:id', verifyToken,  validateCreateChavruta, handleValidationChavruta, getChavrutasByUser);
//router.get('/:id', getCavrutaById);
router.post('/', verifyToken,  validateCreateChavruta, handleValidationChavruta, createChavruta);
router.put('/:id', verifyToken,  validateUpdateChavruta, handleValidationChavruta, authorizeOwnerOrAdmin, updateChavruta);
router.delete('/:id', verifyToken,  validateChavrutaIdParam, handleValidationChavruta, authorizeOwnerOrAdmin, deleteChavruta);

export default router;