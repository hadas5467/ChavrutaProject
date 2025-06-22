import * as userServices from "../dataServices/userServices.js";


export const loginUser = async (req, res) => {

  const { userName, password } = req.query;
  try {
    const user = await userServices.findByUserNameAndPassword(userName, password);
    if (!user) {
      return res.status(401).json({ match: false, message: 'אינך רשום למערכת' });
    }

    res.status(200).json({ match: true, user });
  } catch (error) {
    console.error("שגיאה בהתחברות:", error.message);
    res.status(500).json({ match: false, error: error.message });
  }
};


// קבלת כל המשתמשים
export const getUsers = async (req, res) => {
  try {
    const { userName, email } = req.query;
    let filter = {};
    if (userName) filter.userName = userName;
    if (email) filter.email = email;
    const users = await userServices.findByFilter(filter);
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



// יצירת משתמש חדש
export const createUser = async (req, res) => {
  try {
    let newUser = await userServices.create(req.body);
    res.status(201).json(newUser);  // מחזירים את המשתמש שנוצר
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
    let result = await userServices.update(id, req.body);
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
