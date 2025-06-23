import * as callServices from "../dataServices/callServices.js";

// קבלת כל השיחות (או לפי סינון)
export const getCalls = async (req, res) => {
  try {
    const { userId, chavrutaId } = req.query;
    let filter = {};
    if (userId) filter.userId = userId;
    if (chavrutaId) filter.chavrutaId = chavrutaId;
    const calls = await callServices.findByFilter(filter);
    if (!calls || calls.length === 0) {
      return res.status(404).json({ message: "No calls found" });
    }
    res.status(200).json(calls);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// יצירת שיחה חדשה
export const createCall = async (req, res) => {
  try {
    let newCall = await callServices.create(req.body);
    res.status(201).json(newCall);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// עדכון שיחה קיימת
export const updateCall = async (req, res) => {
  try {
    const id = req.params.id;
    let result = await callServices.update(id, req.body);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Call not found" });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "שגיאה בעדכון השיחה", error: error.message });
  }
};

// מחיקת שיחה
export const deleteCall = async (req, res) => {
  try {
    const id = req.params.id;
    let result = await callServices.delete(id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Call not found" });
    }
    res.status(200).json({ message: "Call deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};