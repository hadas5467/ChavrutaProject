import * as userServices from "../dataServices/userServices.js";
import { generateToken } from "../Middleware/authenticate.js";

export const loginUser = async (req, res) => {

  const { gmail, password } = req.body;
  try {
    const user = await userServices.login(gmail, password);
    if (!user) {
      return res.status(401).json({ match: false, message: 'אינך רשום למערכת' });
    }

    // res.status(200).json({ match: true, user });
    const token = generateToken(user); // 👈 כאן נוצרת ה-JWT

    res
      .cookie('token', token, {
        httpOnly: true,
        secure: false,  // true בפרודקשן עם HTTPS
        //sameSite: 'strict',
        sameSite: 'lax',
        maxAge: 3600000
      })
      .status(200)
      .json({ match: true, user });
  } catch (error) {
    console.error("שגיאה בהתחברות:", error.message);
    res.status(500).json({ match: false, error: "שגיאה בשרת" });
  }
};


export const getUsers = async (req, res) => {
  try {

    const { userName, gmail, userId } = req.query;
    let filter = {};
    if (userName) filter.userName = userName;
    if (gmail) filter.gmail = gmail;
    if (userId) filter.userId = userId;
    const sex = req.user.sex;
    if (!sex) return res.status(401).json({ message: "Unauthorized" });
    if (req.user.role !== 'admin') {
      filter.sex = req.user.sex;
    }
    const users = await userServices.findByFilter(filter);


    res.status(200).json(users ?? []);
  } catch (error) {
    console.error("getUsers error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getById = async (req, res) => {
  try {

     const userId = req.params.id;
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }
    const user = await userServices.getById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("getById error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// יצירת משתמש חדש
export const createUser = async (req, res) => {
  try {
    console.log("Register API hit", req.body);

    // טיפול בקובץ שהועלה
    let profilePath = null;
    if (req.file) {
      profilePath = req.file.filename;
    }

    const userData = {
      ...req.body,
      profile: profilePath
    };

    let newUser = await userServices.create(userData);
    const token = generateToken(newUser); // 

    res
      .cookie('token', token, {
        httpOnly: true,
        secure: false,  // true בפרודקשן עם HTTPS
        sameSite: 'strict',
        maxAge: 3600000
      })
      .json({ message: 'User registered successfully', user: newUser });  // מחזירים את המשתמש שנוצר
  }
  catch (error) {
    console.error('There was an error:', error.message);

    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'האימייל הזה כבר קיים במערכת!' });
    }
    res.status(500).json(error.message);
  }

}

// עדכון משתמש קיים
export const updateUser = async (req, res) => {
  try {
    const id = req.params.id;

    // טיפול בקובץ שהועלה
    let profilePath = null;
    if (req.file) {
      profilePath = req.file.filename; // שם הקובץ שנשמר
    }

    // הוספת נתיב הקובץ לנתוני העדכון
    const updateData = {
      ...req.body,
      ...(profilePath && { profile: profilePath })
    };

    let result = await userServices.update(id, updateData);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).send('שגיאה בעדכון המשתמש', error.message);
  }
};

// מחיקת משתמש
export const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    let result = await userServices.deleteUser(id);  // שימי לב לשם חדש remove
    res.status(200).json(result);
  } catch (error) {
    res.status(500).send('שגיאה במחיקת המשתמש', error.message);
  }
};
