import path from 'path';
import fs from 'fs';

// middleware לבדיקת הרשאות גישה לתמונות פרופיל
export const checkImageAccess = (req, res, next) => {
  try {
    const filename = req.params.filename;
    const userSex = req.user?.sex;
    
    if (!userSex) {
      return res.status(401).json({ message: 'לא מורשה לגשת לתמונה' });
    }

    // בדיקה באיזו תיקייה הקובץ נמצא
    const malePath = path.join('uploads', 'males', filename);
    const femalePath = path.join('uploads', 'females', filename);
    
    const isMaleImage = fs.existsSync(malePath);
    const isFemaleImage = fs.existsSync(femalePath);
    
    if (!isMaleImage && !isFemaleImage) {
      return res.status(404).json({ message: 'תמונה לא נמצאה' });
    }

    // בדיקה אם המשתמש יכול לגשת לתמונה
    if ((userSex === 'male' && !isMaleImage) || (userSex === 'female' && !isFemaleImage)) {
      return res.status(403).json({ message: 'אין לך הרשאה לצפות בתמונה זו' });
    }

    next();
  } catch (error) {
    console.error('Error checking image access:', error);
    res.status(500).json({ message: 'שגיאה בבדיקת הרשאות' });
  }
};


function extractUserIdFromFilename(filename) {
  // אם השם של הקובץ מכיל userId (למשל: profile-123-1234567890.jpg)
  const match = filename.match(/profile-(\d+)-\d+/);
  if (match) {
    return match[1];
  }

  return null;
} 