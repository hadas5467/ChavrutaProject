import pool from './DB.js';
import bcrypt from 'bcrypt';

// קבלת משתמשים עם סינון
export const findByFilter = async (filter = {}) => {
  let sql = `
    SELECT userId, role, name, phone, gmail, age, sex, sector, profile, contactMethod
    FROM USERS`;
  const params = [];
  const conditions = [];

  if (filter.userId) {
    conditions.push('userId = ?');
    params.push(filter.userId);
  }
  if (filter.gmail) {
    conditions.push('gmail = ?');
    params.push(filter.gmail);
  }
  if (filter.role) {
    conditions.push('role = ?');
    params.push(filter.role);
  }
  if (filter.sex) {
    conditions.push('sex = ?');
    params.push(filter.sex);
  }

  if (conditions.length > 0) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }

  const [rows] = await pool.query(sql, params);
  return rows;
};



// בדיקת התחברות (gmail + סיסמה)
export const login = async (gmail, password) => {
  const sql1 = `
    SELECT U.userId, P.passwordHash
    FROM USERS U
    INNER JOIN PASSWORDS P ON U.userId = P.userId
    WHERE U.gmail = ?
    LIMIT 1
  `;
  const [rows1] = await pool.query(sql1, [gmail]);
  const userAuth = rows1[0];
  if (!userAuth) return null;

  const isMatch = await bcrypt.compare(password, userAuth.passwordHash);
  if (!isMatch) return null;

  const sql2 = `SELECT * FROM USERS WHERE userId = ? LIMIT 1`;
  const [rows2] = await pool.query(sql2, [userAuth.id]);
  return rows2[0] || null;
};

// יצירת משתמש חדש
export const create = async (user) => {
  const hashedPassword = await bcrypt.hash(user.password, 10);

  const sqlUser = `
    INSERT INTO USERS 
      (role, name, phone, gmail, sex, age, sector, profile, contactMethod, city, country, languages, bio, experienceLevel, availability, availabilityStatus, tags)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const paramsUser = [
    user.role || 'user',
    user.name,
    user.phone || null,
    user.gmail,
    user.sex,
    user.age,
    user.sector,
    user.profile || null,
    user.contactMethod || 'system',
    user.city || null,
    user.country || null,
     Array.isArray(user.languages) ? user.languages.join(',') : user.languages || null,
    user.bio || null,
    user.experienceLevel || 'beginner',
    JSON.stringify(user.availability || {}),
    user.availabilityStatus || 'available_now',
    user.tags || null
  ];

  const [result] = await pool.query(sqlUser, paramsUser);

  const sqlPass = `INSERT INTO PASSWORDS (userId, passwordHash) VALUES (?, ?)`;
  await pool.query(sqlPass, [result.insertId, hashedPassword]);

  return { id: result.insertId, ...user };
};

// עדכון משתמש
export const update = async (userId, user) => {
  const fields = [];
  const params = [];
  const allowedKeys = [
    'role', 'name', 'phone', 'gmail', 'age', 'sex', 'sector',
    'profile', 'contactMethod', 'city', 'country', 'languages',
    'bio', 'experienceLevel', 'availability', 'availabilityStatus', 'tags'
  ];

  for (const key of allowedKeys) {
    if (user[key] !== undefined) {
      fields.push(`${key} = ?`);
      if (key === 'availability') {
        params.push(JSON.stringify(user[key]));
      } else {
        params.push(user[key]);
      }
    }
  }

  if (fields.length === 0) return null;
  params.push(userId);

  const sql = `UPDATE USERS SET ${fields.join(', ')} WHERE userId = ?`;
  const [result] = await pool.query(sql, params);
  return result;
};

// עדכון סיסמה (עכשיו בטבלת PASSWORDS)
export const updatePassword = async (userId, newPassword) => {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  const sql = 'UPDATE PASSWORDS SET passwordHash = ? WHERE userId = ?';
  const [result] = await pool.query(sql, [hashedPassword, userId]);
  return result;
};

// מחיקת משתמש
export const deleteUser = async (userId) => {
  const sql = 'DELETE FROM USERS WHERE userId = ?';
  const [result] = await pool.query(sql, [userId]);
  return result;
};