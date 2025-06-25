import express from 'express';
import { updateChavruta, getAllChavrutas, createChavruta, deleteChavruta, getChavrutasByUser } from '../controllers/ChavrutaController.js';
import {verifyToken} from '../Middleware/authenticate.js';
import { authorizeAdmin,authorizeOwner,authorizeOwnerOrAdmin } from '../Middleware/authorize.js';
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
router.get('/user/:id', verifyToken, getChavrutasByUser);
//router.get('/:id', getCavrutaById);
router.post('/', verifyToken, createChavruta);
router.put('/:id', verifyToken, authorizeOwnerOrAdmin, updateChavruta);
router.delete('/:id', verifyToken, authorizeOwnerOrAdmin, deleteChavruta);

export default router;