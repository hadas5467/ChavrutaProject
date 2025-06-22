import express from 'express';
import { getUsers, loginUser, createUser, updateUser, deleteUser } from '../controllers/userController.js';
import { verifyToken } from '../Middleware/authenticate.js';
import { authorizeAdmin,authorizeOwner,authorizeOwnerOrAdmin } from '../Middleware/authorize.js';
const authorizeUserOwner = authorizeOwner({
  tableName: 'USERS',
  idField: 'userId',
  ownerFields: ['userId'],
  paramName: 'id'
});

const authorizeUserOwnerOrAdmin = authorizeOwnerOrAdmin({
  tableName: 'USERS',
  idField: 'userId',
  ownerFields: ['userId'],
  paramName: 'id'
});
const router = express.Router();

router.get('/', verifyToken, getUsers);
router.post('/logIn', loginUser);
router.post('/register', createUser);
router.put('/:id', verifyToken, authorizeUserOwnerOrAdmin, updateUser);
//להפוך בהמשך לחסימת משתמש
router.delete('/:id', verifyToken, authorizeAdmin, deleteUser);

export default router;