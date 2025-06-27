import * as joinRequestServices from "../dataServices/joinRequestSevices.js";
import * as service from "../services/joinRequestService.js";
// קבלת כל הבקשות (או לפי סינון)
export const getAllJoinRequests = async (req, res) => {
  try {
    const { userId, callId, status, joinRequestId } = req.query;
    let filter = {};
    if (userId) filter.userId = userId;
    if (callId) filter.callId = callId;
    if (status) filter.status = status;
    if (joinRequestId) filter.joinRequestId = joinRequestId;

    const joinRequests = await joinRequestServices.findByFilter(filter);
    
    // תמיד מחזירים 200 עם מערך (גם אם ריק)
    res.status(200).json(joinRequests ?? []);
  } catch (error) {
    console.error("getJoinRequests error:", error);
    res.status(500).json({ message: "שגיאה בשרת" });
  }
};

export const getJoinRequestsByUser = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "משתמש לא מחובר" });

    const joinRequests = await joinRequestServices.findByFilter({ targetUserId: userId });
    res.status(200).json(joinRequests ?? []);
  } catch (error) {
    console.error("getJoinRequestsByUser error:", error);
    res.status(500).json({ message: "שגיאה בשרת" });
  }
};


// יצירת בקשה חדשה
export const createJoinRequest = async (req, res) => {
  try {
    let newJoinRequest = await service.handleJoinRequest(req.body);
    res.status(201).json(newJoinRequest);
  } catch (error) {
    console.error("createJoinRequest error:", error);
    res.status(500).json({ message: "שגיאה בשרת" });
  }
};

// עדכון בקשה קיימת
export const updateJoinRequest = async (req, res) => {
  try {
    const id = req.params.id;
    let result = await joinRequestServices.update(id, req.body);
    if (!result || result.affectedRows === 0) {
      return res.status(404).json({ message: "לא נמצא" });
    }
    res.status(200).json({ message: "עודכן בהצלחה" });
  } catch (error) {
    console.error("updateJoinRequest error:", error);
    res.status(500).json({ message: "שגיאה בשרת" });
  }
};

// מחיקת בקשה
export const deleteJoinRequest = async (req, res) => {
  try {
    const id = req.params.id;
     await service.handleJoinRequestDelete(id);
    let result = await joinRequestServices.deleteJoinRequest(id);// נניח שיש פונקציה שמטפלת במחיקת בקשה
    if (!result || result.affectedRows === 0) {
      return res.status(404).json({ message: "לא נמצא" });
    }
    res.status(200).json({ message: "נמחק בהצלחה" });
  } catch (error) {
    console.error("deleteJoinRequest error:", error);
    res.status(500).json({ message: "שגיאה בשרת" });
  }
};

//npm install nodemailer
