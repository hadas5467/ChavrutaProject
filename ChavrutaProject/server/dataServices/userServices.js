import pool from './DB.js';
import bcrypt from 'bcrypt';

// קבלת משתמשים עם סינון (user, gmail, role וכו')
export const findByFilter = async (filter = {}) => {
  let sql = 'SELECT userId, user, role, name, phone, gmail, age, sex, sector, profile, contactMethod FROM USERS';
  const params = [];
  const conditions = [];

  if (filter.user) {
    conditions.push('user = ?');
    params.push(filter.user);
  }
  if (filter.gmail) {
    conditions.push('gmail = ?');
    params.push(filter.gmail);
  }
  if (filter.role) {
    conditions.push('role = ?');
    params.push(filter.role);
  }

  if (conditions.length > 0) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }

  const [rows] = await pool.promise().query(sql, params);
  return rows;
};

// קבלת משתמש לפי gmail (לצורך login)
export const findByGmail = async (gmail) => {
  const sql = 'SELECT * FROM USERS WHERE  gmail = ? LIMIT 1';
  const [rows] = await pool.promise().query(sql, [gmail]);
  return rows[0];
};

// בדיקת התחברות (gmail + סיסמה)
export const login = async (gmail, password) => {
  // שלב 1: שליפת userId וה-hash בלבד
  const sql1 = `
    SELECT U.userId, P.passwordHash
    FROM USERS U
    INNER JOIN PASSWORDS P ON U.userId = P.userId
    WHERE U.gmail = ?
    LIMIT 1
  `;
  const [rows1] = await pool.promise().query(sql1, [gmail]);
  const userAuth = rows1[0];

  if (!userAuth) return null;

  // בדיקת הסיסמה
  const isMatch = await bcrypt.compare(password, userAuth.passwordHash);
  if (!isMatch) return null;

  // שלב 2: הסיסמה תקינה – שלוף את פרטי המשתמש המלאים
  const sql2 = `SELECT * FROM USERS WHERE userId = ? LIMIT 1`;
  const [rows2] = await pool.promise().query(sql2, [userAuth.userId]);
  return rows2[0] || null;
};

// יצירת משתמש חדש (עם הצפנת סיסמה)
export const create = async (user) => {
  const hashedPassword = await bcrypt.hash(user.password, 10);

  // 1. יצירת משתמש בטבלת USERS (ללא סיסמה)
  const sqlUser = `INSERT INTO USERS 
    (user, role, name, phone, gmail, age, sex, sector, profile, contactMethod)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const paramsUser = [
    user.user,
    user.role || 'user',
    user.name,
    user.phone,
    user.gmail,
    user.age,
    user.sex,
    user.sector,
    user.profile,
    user.contactMethod
  ];
  const [result] = await pool.promise().query(sqlUser, paramsUser);

  // 2. שמירת הסיסמה בטבלת PASSWORDS
  const sqlPass = `INSERT INTO PASSWORDS (userId, passwordHash) VALUES (?, ?)`;
  await pool.promise().query(sqlPass, [result.insertId, hashedPassword]);

  return { userId: result.insertId, ...user, password: undefined };
};

// עדכון משתמש (ללא סיסמה)
export const update = async (userId, user) => {
  const fields = [];
  const params = [];
  for (const key of ['user', 'role', 'name', 'phone', 'gmail', 'age', 'sex', 'sector', 'profile', 'contactMethod']) {
    if (user[key] !== undefined) {
      fields.push(`${key} = ?`);
      params.push(user[key]);
    }
  }
  if (fields.length === 0) return null;
  params.push(userId);
  const sql = `UPDATE USERS SET ${fields.join(', ')} WHERE userId = ?`;
  const [result] = await pool.promise().query(sql, params);
  return result;
};

// עדכון סיסמה בלבד
export const updatePassword = async (userId, newPassword) => {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  const sql = 'UPDATE USERS SET password = ? WHERE userId = ?';
  const [result] = await pool.promise().query(sql, [hashedPassword, userId]);
  return result;
};

// מחיקת משתמש
export const deleteUser = async (userId) => {
  const sql = 'DELETE FROM USERS WHERE userId = ?';
  const [result] = await pool.promise().query(sql, [userId]);
  return result;
};