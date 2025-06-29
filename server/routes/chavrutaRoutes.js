import express from 'express';
import { updateChavruta, getAllChavrutas, createChavruta, deleteChavruta, getChavrutasByUser } from '../controllers/chavrutaController.js';
import {verifyToken} from '../Middleware/authenticate.js';
import { authorizeAdmin } from '../Middleware/authorize.js';
import {
  validateChavrutaIdParam,
  validateCreateChavruta,
  validateUpdateChavruta
} from '../validations/chavrutaValidation.js';
import { handleValidation } from '../Middleware/handleValidation.js';


const router = express.Router();

router.get('/', verifyToken,authorizeAdmin, getAllChavrutas);
router.get('/user/:id', verifyToken,  validateChavrutaIdParam, handleValidation, getChavrutasByUser);
router.post('/', verifyToken,  validateCreateChavruta, handleValidation, createChavruta);
router.put('/:id', verifyToken,  validateUpdateChavruta, handleValidation, updateChavruta);
router.delete('/:id', verifyToken,  validateChavrutaIdParam, handleValidation, authorizeAdmin, deleteChavruta);

export default router;

// משהו יפה שהתלבטנו על נכונותו
// const authorizeChavrutaOwner = authorizeOwner({
//   tableName: 'CHAVRUTA',
//   idField: 'chavrutaId',
//   ownerFields: ['user1', 'user2'],
//   paramName: 'id'
// });

// const authorizeChavrutaOwnerOrAdmin = authorizeOwnerOrAdmin({
//   tableName: 'CHAVRUTA',
//   idField: 'chavrutaId',
//   ownerFields: ['user1', 'user2'],
//   paramName: 'id'
// });