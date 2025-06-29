// import * as joinRequestServices from "../dataServices/joinRequestSevices.js";
// import * as service from "../services/joinRequestService.js";
// //import { approveJoinRequest } from '../services/joinRequestService.js';


// // קבלת כל הבקשות (או לפי סינון)
// export const getAllJoinRequests = async (req, res) => {
//   try {
//  const { 
//       userId, callId, status, joinRequestId, targetUserId,
//       userSearch, search, startDate, endDate, sortBy, sortOrder,
//       subject, learningFormat, place
//     } = req.query; 
//     let filter = {};
//     if (targetUserId) filter.targetUserId = targetUserId;
//     if (userSearch) filter.userSearch = userSearch;
//     if (search) filter.search = search;
//     if (startDate) filter.startDate = startDate;
//     if (endDate) filter.endDate = endDate;
//     if (sortBy) filter.sortBy = sortBy;
//     if (sortOrder) filter.sortOrder = sortOrder;
//  if (subject) filter.subject = subject;
//     if (learningFormat) filter.learningFormat = learningFormat;
//     if (place) filter.place = place;
//     const joinRequests = await joinRequestServices.findByFilter(filter);
    
//     // תמיד מחזירים 200 עם מערך (גם אם ריק)
//     res.status(200).json(joinRequests ?? []);
//   } catch (error) {
//     console.error("getJoinRequests error:", error);
//     res.status(500).json({ message: "שגיאה בשרת" });
//   }
// };

// export const getJoinRequestsByUser = async (req, res) => {
//   try {
//     const userId = req.user?.id;
//     if (!userId) return res.status(401).json({ message: "משתמש לא מחובר" });
// const { 
//        callId, status, joinRequestId, targetUserId,
//       userSearch, search, startDate, endDate, sortBy, sortOrder,
//       subject, learningFormat, place
//     } = req.query; 
//     let filter = {};
//     if (targetUserId) filter.targetUserId = targetUserId;
//     if (userSearch) filter.userSearch = userSearch;
//     if (search) filter.search = search;
//     if (startDate) filter.startDate = startDate;
//     if (endDate) filter.endDate = endDate;
//     if (sortBy) filter.sortBy = sortBy;
//     if (sortOrder) filter.sortOrder = sortOrder;
//  if (subject) filter.subject = subject;
//     if (learningFormat) filter.learningFormat = learningFormat;
//     if (place) filter.place = place;
//     const joinRequests = await joinRequestServices.findByFilter({ targetUserId: userId , ...filter });
    
//     res.status(200).json(joinRequests ?? []);
//   } catch (error) {
//     console.error("getJoinRequestsByUser error:", error);
//     res.status(500).json({ message: "שגיאה בשרת" });
//   }
// };


// export const approveJoinRequestController = async (req, res) => {
//   try {
//     const { user1, user2, callId } = req.body;
//     if (!user1 || !user2 || !callId) {
//       return res.status(400).json({ message: "שדות חסרים" });
//     }

//     const result = await service.approveJoinRequest({ user1, user2, callId });
//     res.status(200).json(result);
//   } catch (error) {
//     console.error("approveJoinRequest error:", error);
//     res.status(500).json({ message: "שגיאה באישור הבקשה" });
//   }
// };


// export const getJoinRequestsByCall = async (req, res) => {
//   try {
//     const { callId } = req.params;
//     if (!callId) return res.status(400).json({ message: "callId חסר" });

//     const joinRequests = await joinRequestServices.findByFilter({ callId });
//     res.status(200).json(joinRequests ?? []);
//   } catch (error) {
//     console.error("getJoinRequestsByCall error:", error);
//     res.status(500).json({ message: "שגיאה בשרת" });
//   }
// };


// // יצירת בקשה חדשה
// export const createJoinRequest = async (req, res) => {
//   try {
//     const { targetUserId, userId } = req.body;
//     if (targetUserId === userId) {
//       return res.status(400).json({ message: "לא ניתן להצטרף לחברותא עם עצמך" });
//     }
//     let newJoinRequest = await service.handleJoinRequest(req.body);
//     res.status(201).json(newJoinRequest);
//   } catch (error) {
//     console.error("createJoinRequest error:", error);
//     res.status(500).json({ message: "שגיאה בשרת" });
//   }
// };

// // עדכון בקשה קיימת
// export const updateJoinRequest = async (req, res) => {
//   try {
//     const id = req.params.id;
//     let result = await joinRequestServices.update(id, req.body);
//     if (!result || result.affectedRows === 0) {
//       return res.status(404).json({ message: "לא נמצא" });
//     }
//     res.status(200).json({ message: "עודכן בהצלחה" });
//   } catch (error) {
//     console.error("updateJoinRequest error:", error);
//     res.status(500).json({ message: "שגיאה בשרת" });
//   }
// };

// // מחיקת בקשה
// // export const deleteJoinRequest = async (req, res) => {
// //   try {
// //     const id = req.params.id;
// //      await service.handleJoinRequestDelete(id);
// //     let result = await joinRequestServices.deleteJoinRequest(id);// נניח שיש פונקציה שמטפלת במחיקת בקשה
// //     if (!result || result.affectedRows === 0) {
// //       return res.status(404).json({ message: "לא נמצא" });
// //     }
// //     res.status(200).json({ message: "נמחק בהצלחה" });
// //   } catch (error) {
// //     console.error("deleteJoinRequest error:", error);
// //     res.status(500).json({ message: "שגיאה בשרת" });
// //   }
// // };


// import { handleJoinRequestDelete } from '../services/joinRequestService.js';

// export const deleteJoinRequest = async (req, res) => {
//   try {
//     const id = req.params.id;

//     const result = await handleJoinRequestDelete(id); // ✔️ מחיקה + מייל

//     if (!result || result.affectedRows === 0) {
//       return res.status(404).json({ message: "לא נמצא" });
//     }

//     res.status(200).json({ message: "נמחק בהצלחה" });
//   } catch (error) {
//     console.error("deleteJoinRequest error:", error);
//     res.status(500).json({ message: "שגיאה בשרת" });
//   }
// };



// //npm install nodemailer



import * as joinRequestServices from "../dataServices/joinRequestSevices.js";
import * as service from "../services/joinRequestService.js";
import { handleJoinRequestDelete } from '../services/joinRequestService.js';

// קבלת כל הבקשות (או לפי סינון)
export const getAllJoinRequests = async (req, res) => {
  try {
    const {
      userId, callId, status, joinRequestId, targetUserId,
      userSearch, search, startDate, endDate, sortBy, sortOrder,
      subject, learningFormat, place
    } = req.query;

    let filter = {};
    if (targetUserId) filter.targetUserId = targetUserId;
    if (userSearch) filter.userSearch = userSearch;
    if (search) filter.search = search;
    if (startDate) filter.startDate = startDate;
    if (endDate) filter.endDate = endDate;
    if (sortBy) filter.sortBy = sortBy;
    if (sortOrder) filter.sortOrder = sortOrder;
    if (subject) filter.subject = subject;
    if (learningFormat) filter.learningFormat = learningFormat;
    if (place) filter.place = place;

    const joinRequests = await joinRequestServices.findByFilter(filter);
    res.status(200).json(joinRequests ?? []);
  } catch (error) {
    console.error("getJoinRequests error:", error.message);
    res.status(500).json({ message: "שגיאה בשרת" });
  }
};

export const getJoinRequestsByUser = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "משתמש לא מחובר" });

    const {
      callId, status, joinRequestId, targetUserId,
      userSearch, search, startDate, endDate, sortBy, sortOrder,
      subject, learningFormat, place
    } = req.query;

    let filter = {};
    if (targetUserId) filter.targetUserId = targetUserId;
    if (userSearch) filter.userSearch = userSearch;
    if (search) filter.search = search;
    if (startDate) filter.startDate = startDate;
    if (endDate) filter.endDate = endDate;
    if (sortBy) filter.sortBy = sortBy;
    if (sortOrder) filter.sortOrder = sortOrder;
    if (subject) filter.subject = subject;
    if (learningFormat) filter.learningFormat = learningFormat;
    if (place) filter.place = place;

    const joinRequests = await joinRequestServices.findByFilter({ targetUserId: userId, ...filter });
    res.status(200).json(joinRequests ?? []);
  } catch (error) {
    console.error("getJoinRequestsByUser error:", error.message);
    res.status(500).json({ message: "שגיאה בשרת" });
  }
};

export const getJoinRequestsByCall = async (req, res) => {
  try {
    const { callId } = req.params;
    if (!callId) return res.status(400).json({ message: "callId חסר" });

    const joinRequests = await joinRequestServices.findByFilter({ callId });
    res.status(200).json(joinRequests ?? []);
  } catch (error) {
    console.error("getJoinRequestsByCall error:", error.message);
    res.status(500).json({ message: "שגיאה בשרת" });
  }
};

export const createJoinRequest = async (req, res) => {
  try {
    const { targetUserId, userId } = req.body;

    if (targetUserId === userId) {
      return res.status(400).json({ message: "לא ניתן להצטרף לחברותא עם עצמך" });
    }

    const newJoinRequest = await service.handleJoinRequest(req.body);
    res.status(201).json(newJoinRequest);
  } catch (error) {
    console.error("createJoinRequest error:", error.message);
    res.status(500).json({ message: "שגיאה בשרת" });
  }
};

export const approveJoinRequestController = async (req, res) => {
  try {
    const { user1, user2, callId } = req.body;

    if (!user1 || !user2 || !callId) {
      return res.status(400).json({ message: "שדות חסרים" });
    }

    const result = await service.approveJoinRequest({ user1, user2, callId });
    res.status(200).json(result);
  } catch (error) {
    console.error("approveJoinRequest error:", error.message);
    res.status(500).json({ message: "שגיאה באישור הבקשה" });
  }
};

export const updateJoinRequest = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await joinRequestServices.update(id, req.body);

    if (!result || result.affectedRows === 0) {
      return res.status(404).json({ message: "לא נמצא" });
    }

    res.status(200).json({ message: "עודכן בהצלחה" });
  } catch (error) {
    console.error("updateJoinRequest error:", error.message);
    res.status(500).json({ message: "שגיאה בשרת" });
  }
};

export const deleteJoinRequest = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await handleJoinRequestDelete(id); // ✔️ כולל מחיקת טבלת ביניים + מייל

    if (!result || result.affectedRows === 0) {
      return res.status(404).json({ message: "לא נמצא" });
    }

    res.status(200).json({ message: "נמחק בהצלחה" });
  } catch (error) {
    console.error("deleteJoinRequest error:", error.message);
    res.status(500).json({ message: "שגיאה בשרת" });
  }
};
