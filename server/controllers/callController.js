import * as callServices from "../dataServices/callServices.js";

// קבלת כל השיחות (או לפי סינון)
export const getCalls = async (req, res) => {
  try {
    const { userId, place, learningFormat, subject, ageRange, isActive, callId } = req.query;
    let filter = {};
    if (userId) filter.userId = userId;
    if (place) filter.place = place;
    if (learningFormat) filter.learningFormat = learningFormat;
    if (subject) filter.subject = subject;
    if (ageRange) filter.ageRange = ageRange;
    if (isActive !== undefined) filter.isActive = isActive;
    if (callId) filter.callId = callId;

    const calls = await callServices.findByFilter(filter);
    // תמיד מחזירים 200 עם מערך (גם אם ריק)
    res.status(200).json(calls ?? []);
  } catch (error) {
    console.error("getCalls error:", error);
    res.status(500).json({ message: "שגיאה בשרת" });
  }
};

// יצירת שיחה חדשה
export const createCall = async (req, res) => {
  try {
    let newCall = await callServices.create(req.body);
    res.status(201).json(newCall);
  } catch (error) {
    console.error("createCall error:", error);
    res.status(500).json({ message: "שגיאה בשרת" });
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