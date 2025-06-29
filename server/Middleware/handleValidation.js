// validations/handleValidation.js
import { validationResult } from 'express-validator';

export const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error("Validation Error:", errors.array());
    return res.status(400).json({ message: "שגיאה בנתונים שנשלחו" });
  }
  next();
};
