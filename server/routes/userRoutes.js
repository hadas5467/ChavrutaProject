import express from 'express';
import { getUsers,getById, loginUser,logoutUser, createUser, updateUser, deleteUser } from '../controllers/userController.js';
import { verifyToken } from '../Middleware/authenticate.js';
import { authorizeAdmin,authorizeOwner,authorizeOwnerOrAdmin } from '../Middleware/authorize.js';
import upload  from '../Middleware/multer.js';
import { checkImageAccess } from '../Middleware/imageAccess.js';
import path from 'path';
import {
  validateUserIdParam,
  validateCreateUser,
  validateUpdateUser,
  validateLogin
} from '../validations/userValidation.js';
import { handleValidation } from '../Middleware/handleValidation.js';

const router = express.Router();

router.get('/', verifyToken, getUsers);
router.get('/:id', verifyToken,  validateUserIdParam, handleValidation,getById);
router.post('/logIn' , validateLogin, handleValidation, loginUser);
router.post('/register', upload.single("profile"),validateCreateUser, handleValidation, createUser);
router.post('/logout', logoutUser);
router.put('/:id', verifyToken, upload.single("profile"),validateUpdateUser, handleValidation, updateUser);
//להפוך בהמשך לחסימת משתמש
router.delete('/:id', verifyToken, validateUserIdParam, handleValidation, authorizeAdmin, deleteUser);
router.get('/profile/:filename', verifyToken, checkImageAccess, (req, res) => {

const filename = req.params.filename;
  const userSex = req.user.sex; // המין של המשתמש שמבקש
  const folder = userSex === 'male' ? 'males' : 'females';
  const imagePath = path.join('uploads', folder, filename);
  console.log(`Serving image from path: ${imagePath}`); // לוג כדי לוודא שהנתיב נכון
try{
  res.sendFile(path.join(process.cwd(), imagePath));
}
catch (error) {
    console.error("Error serving image:", error);
    res.status(404).json({ message: "server error" });
  }

});

export default router;
//מבנה יפה של בדיקות הרשאה שהתלבטנו על נכונותו
// const authorizeUserOwner = authorizeOwner({
//   tableName: 'USERS',
//   idField: 'userId',
//   ownerFields: ['userId'],
//   paramName: 'id'
// });

// const authorizeUserOwnerOrAdmin = authorizeOwnerOrAdmin({
//   tableName: 'USERS',
//   idField: 'userId',
//   ownerFields: ['userId'],
//   paramName: 'id'
// });