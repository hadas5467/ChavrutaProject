import multer from 'multer';
import path from 'path';
import fs from 'fs';

const allowedExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // קביעת התיקייה לפי המין
    let uploadPath = 'uploads/';
    
    // אם יש מין בבקשה (מהרישום או עדכון)
    const userSex = req.body.sex || req.user?.sex;
    
    if (userSex) {
      uploadPath += userSex === 'male' ? 'males/' : 'females/';
    } else {
      console.log("Unknown gender");
      res.status(400).json({ error: 'בעיה בשרת' });
    }
    
    // יצירת התיקייה אם היא לא קיימת
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    
    // שם קובץ פשוט יותר
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // עד 2MB
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (file.mimetype.startsWith('image/') && allowedExts.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

export default upload;