import express from 'express';
import { getUsers, loginUser, createUser, updateUser, deleteUser } from '../controllers/userController.js';
import { verifyToken } from '../Middleware/authenticate.js';
import { authorizeAdmin,authorizeOwner,authorizeOwnerOrAdmin } from '../Middleware/authorize.js';
import upload  from '../Middleware/multer.js';
import { checkImageAccess } from '../Middleware/imageAccess.js';
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
router.post('/register', upload.single("profile"), createUser);
router.put('/:id', verifyToken, authorizeUserOwnerOrAdmin, upload.single("profile"), updateUser);
//להפוך בהמשך לחסימת משתמש
router.delete('/:id', verifyToken, authorizeAdmin, deleteUser);
router.get('/profile/:filename', verifyToken, checkImageAccess, (req, res) => {
  const filename = req.params.filename;
  const userSex = req.user.sex;
  // קביעת הנתיב לפי המין של המשתמש
  const imagePath = path.join('uploads', userSex === 'male' ? 'males' : 'females', filename); 
  res.sendFile(path.join(process.cwd(), imagePath));
});

export default router;