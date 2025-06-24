import * as chavrutaServices from "../dataServices/chavrutaServices.js";

// קבלת כל החברותות (או לפי סינון)
export const getChavrutas = async (req, res) => {
  try {
    const { chavrutaId, user1, user2, callId, status } = req.query;
    let filter = {};
    if (chavrutaId) filter.chavrutaId = chavrutaId;
    if (user1) filter.user1 = user1;
    if (user2) filter.user2 = user2;
    if (callId) filter.callId = callId;
    if (status) filter.status = status;

    const chavrutas = await chavrutaServices.findByFilter(filter);
    // תמיד מחזירים 200 עם מערך (גם אם ריק)
    res.status(200).json(chavrutas ?? []);
  } catch (error) {
    console.error("getChavrutas error:", error);
    res.status(500).json({ message: "שגיאה בשרת" });
  }
};

// יצירת חברותא חדשה
export const createChavruta = async (req, res) => {
  try {
    let newChavruta = await chavrutaServices.create(req.body);
    res.status(201).json(newChavruta);
  } catch (error) {
    console.error("createChavruta error:", error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'החברותא הזו כבר קיימת במערכת!' });
    }
    res.status(500).json({ message: "שגיאה בשרת" });
  }
};

// עדכון חברותא קיימת
export const updateChavruta = async (req, res) => {
  try {
    const id = req.params.id;
    let result = await chavrutaServices.update(id, req.body);
    if (!result || result.affectedRows === 0) {
      return res.status(404).json({ message: "לא נמצא" });
    }
    res.status(200).json({ message: "עודכן בהצלחה" });
  } catch (error) {
    console.error("updateChavruta error:", error);
    res.status(500).json({ message: "שגיאה בשרת" });
  }
};

// מחיקת חברותא
export const deleteChavruta = async (req, res) => {
  try {
    const id = req.params.id;
    let result = await chavrutaServices.deleteChavruta(id);
    if (!result || result.affectedRows === 0) {
      return res.status(404).json({ message: "לא נמצא" });
    }
    res.status(200).json({ message: "נמחק בהצלחה" });
  } catch (error) {
    console.error("deleteChavruta error:", error);
    res.status(500).json({ message: "שגיאה בשרת" });
  }
};