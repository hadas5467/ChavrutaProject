import multer from 'multer';
import path from 'path';
import fs from 'fs';

const allowedExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = 'uploads/';
    const userSex = req.body.sex || req.user?.sex;
    let folder = '';
    if (userSex) {
      folder = userSex === 'male' ? 'males' : 'females';
      uploadPath += folder + '/';
    } else {
      folder = 'unknown';
      uploadPath += folder + '/';
    }
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    // שמור את שם התיקייה ב־req למטה
    req.uploadFolder = folder;
    cb(null, uploadPath);
},
filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const filename = file.fieldname + '-' + uniqueSuffix + ext;
    // שמור את הנתיב היחסי ב־req
    req.relativeProfilePath = req.uploadFolder + '/' + filename;
    cb(null, filename);
}
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // עד 10MB
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