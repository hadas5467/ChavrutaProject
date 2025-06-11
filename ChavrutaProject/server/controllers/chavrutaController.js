import * as chavrutaServices from "../dataServices/chavrutaServices.js";



// קבלת כל החבורות (או לפי סינון)
export const getChavrutas = async (req, res) => {
  try {
    const { chavrutaName, topic } = req.query;
    let filter = {};
    if (chavrutaName) filter.chavrutaName = chavrutaName;
    if (topic) filter.topic = topic;
    const chavrutas = await chavrutaServices.findByNameAndTopic(filter);
    if (!chavrutas || chavrutas.length === 0) {
      return res.status(404).json({ message: "No chavrutas found" });
    }
    res.status(200).json(chavrutas);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// יצירת חברותא חדשה
export const createChavruta = async (req, res) => {
  try {
    let newChavruta = await chavrutaServices.create(req.body);
    res.status(201).json(newChavruta);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'החברותא הזו כבר קיימת במערכת!' });
    }
    res.status(500).json({ message: error.message });
  }
};

// עדכון חברותא קיימת
export const updateChavruta = async (req, res) => {
  try {
    const id = req.params.id;
    let result = await chavrutaServices.update(id, req.body);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Chavruta not found" });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "שגיאה בעדכון החברותא", error: error.message });
  }
};

// מחיקת חברותא
export const deleteChavruta = async (req, res) => {
  try {
    const id = req.params.id;
    let result = await chavrutaServices.delete(id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Chavruta not found" });
    }
    res.status(200).json({ message: "Chavruta deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};