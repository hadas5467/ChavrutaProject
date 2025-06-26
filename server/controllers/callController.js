import * as callServices from "../dataServices/callServices.js";
import { handleCallCreation } from '../services/callService.js';
// קבלת כל השיחות (או לפי סינון)
export const getCalls = async (req, res) => {
  try {
    const sex = req.user.sex;
    const id = req.user.id;
    const { userId, place, learningFormat, subject, ageRange, isActive, callId  } = req.query;
    let filter = {};

    // אם המשתמש הוא לא מנהל, החל תמיד סינון לפי המזהה שלו
    if (role !== 'admin') {
      filter.userId = currentUserId;
    } else if (userId) {
      // אם הוא מנהל וביקש מזהה ספציפי, סנן לפיו
      filter.userId = userId;
    }
    if (userId) filter.userId = userId;
    if (place) filter.place = place;
    if (learningFormat) filter.learningFormat = learningFormat;
    if (subject) filter.subject = subject;
    if (ageRange) filter.ageRange = ageRange;
    if (isActive !== undefined) filter.isActive = isActive;
    if (callId) filter.callId = callId;
  if (!sex) return res.status(401).json({ message: "Unauthorized" });
    if (req.user.role !== 'admin') {
      filter.sex=sex;
      filter.targetUserId = id; // הוספת מזהה המשתמש כדי להחזיר רק שיחות רלוונטיות
    }
    else{

    }
    const calls = await callServices.findByFilter(filter);
    // תמיד מחזירים 200 עם מערך (גם אם ריק)
    res.status(200).json(calls ?? []);
  } catch (error) {
    console.error("getCalls error:", error);
    res.status(500).json({ message: "שגיאה בשרת" });
  }
};

export const createCall = async (req, res) => {
  try {
    const callData = req.body;
    const senderUser = req.user; // נניח שהמידע על המשתמש מגיע מה-token

    const createdCall = await handleCallCreation(callData, senderUser);

    res.status(201).json({ success: true, call: createdCall });
  } catch (error) {
    console.error("שגיאה ביצירת קריאה:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

// עדכון שיחה קיימת
export const updateCall = async (req, res) => {
  try {
    const id = req.params.id;
    let result = await callServices.update(id, req.body);
    if (!result || result.affectedRows === 0) {
      // לא לחשוף למה לא נמצא
      return res.status(404).json({ message: "לא נמצא" });
    }
    res.status(200).json({ message: "עודכן בהצלחה" });
  } catch (error) {
    console.error("updateCall error:", error);
    res.status(500).json({ message: "שגיאה בשרת" });
  }
};

// עדכון סטטוס שיחה
export const updateCallStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const { isActive } = req.body;
    let result = await callServices.updateCallStatus(id, isActive);
    if (!result || result.affectedRows === 0) {
      return res.status(404).json({ message: "לא נמצא" });
    }
    res.status(200).json({ message: "עודכן בהצלחה" });
  } catch (error) {
    console.error("updateCallStatus error:", error);
    res.status(500).json({ message: "שגיאה בשרת" });
  }
};

// מחיקת שיחה
export const deleteCall = async (req, res) => {
  try {
    const id = req.params.id;
    let result = await callServices.deleteCall(id);
    if (!result || result.affectedRows === 0) {
      return res.status(404).json({ message: "לא נמצא" });
    }
    res.status(200).json({ message: "נמחק בהצלחה" });
  } catch (error) {
    console.error("deleteCall error:", error);
    res.status(500).json({ message: "שגיאה בשרת" });
  }
};