import * as callServices from "../dataServices/callServices.js";
import { handleCallCreation } from '../services/callService.js';
// קבלת כל השיחות (או לפי סינון)
export const getCalls = async (req, res) => {
  try {
    const sex = req.user.sex;
    const currentUserId = req.user.id;
    const role = req.user.role; // תיקון: role במקום id
    const { 
      userId, place, learningFormat, subject, ageRange, isActive, callId,
      userSearch, subjectSearch, startDate, endDate, sortBy, sortOrder, search
    } = req.query;
     if (userSearch) filter.userSearch = userSearch;
    if (subjectSearch) filter.subjectSearch = subjectSearch;
    if (startDate) filter.startDate = startDate;
    if (endDate) filter.endDate = endDate;
    if (sortBy) filter.sortBy = sortBy;
    if (sortOrder) filter.sortOrder = sortOrder;
    if (search) filter.search = search;
    let filter = {};

    if (!sex || !currentUserId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // אם המשתמש הוא לא מנהל, הצג רק קריאות שנשלחו אליו
    if (role !== 'admin') {
      filter.targetUserId = currentUserId; // תיקון: currentUserId במקום id
    } else if (userId) {
      // אם הוא מנהל וביקש מזהה ספציפי, סנן לפיו
      filter.targetUserId = userId;
    }

 
  
    if (place) filter.place = place;
    if (learningFormat) filter.learningFormat = learningFormat;
    if (subject) filter.subject = subject;
    if (ageRange) filter.ageRange = ageRange;
    if (isActive !== undefined) filter.isActive = isActive;
    if (callId) filter.callId = callId;

    const calls = await callServices.findByFilter(filter);
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