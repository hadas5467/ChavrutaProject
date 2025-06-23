import * as joinRequestServices from "../dataServices/joinRequestSevices.js";

// קבלת כל הבקשות (או לפי סינון)
export const getJoinRequests = async (req, res) => {
  try {
    const { userId, chavrutaId, status } = req.query;
    let filter = {};
    if (userId) filter.userId = userId;
    if (chavrutaId) filter.chavrutaId = chavrutaId;
    if (status) filter.status = status;
    const joinRequests = await joinRequestServices.findByFilter(filter);
    if (!joinRequests || joinRequests.length === 0) {
      return res.status(404).json({ message: "No join requests found" });
    }
    res.status(200).json(joinRequests);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// יצירת בקשה חדשה
export const createJoinRequest = async (req, res) => {
  try {
    let newJoinRequest = await joinRequestServices.create(req.body);
    res.status(201).json(newJoinRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// עדכון בקשה קיימת
export const updateJoinRequest = async (req, res) => {
  try {
    const id = req.params.id;
    let result = await joinRequestServices.update(id, req.body);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Join request not found" });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "שגיאה בעדכון הבקשה", error: error.message });
  }
};

// מחיקת בקשה
export const deleteJoinRequest = async (req, res) => {
  try {
    const id = req.params.id;
    let result = await joinRequestServices.delete(id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Join request not found" });
    }
    res.status(200).json({ message: "Join request deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};