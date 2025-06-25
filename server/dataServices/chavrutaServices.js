import pool from './DB.js';


export const getCallWithUser = async (callId, userSex) => {
  const sql = `
    SELECT c.*, u.userId as user_userId, u.name as user_name, u.gmail as user_gmail, u.profile as user_profile, u.sex as user_sex
    FROM CALLS c
    JOIN USERS u ON c.userId = u.userId
    WHERE c.callId = ? AND u.sex = ?
  `;
  const [rows] = await pool.query(sql, [callId, userSex]);
  if (rows.length === 0) return null;
  const row = rows[0];
  return {
    ...row,
    id: row.callId,
    user: {
      userId: row.user_userId,
      name: row.user_name,
      gmail: row.user_gmail,
      profile: row.user_profile,
      sex: row.user_sex
      // הוסף כאן שדות נוספים שתרצה מהמשתמש
    }
  };
};
// קבלת חברותות עם סינון
export const findByFilter = async (filter = {}) => {
  let sql = 'SELECT * FROM CHAVRUTA';
  const params = [];
  const conditions = [];
  if (filter.chavrutaId) {
    conditions.push('chavrutaId = ?');
    params.push(filter.chavrutaId);
  }
  if (filter.user1) {
    conditions.push('user1 = ?');
    params.push(filter.user1);
  }
  if (filter.user2) {
    conditions.push('user2 = ?');
    params.push(filter.user2);
  }
  if (filter.callId) {
    conditions.push('callId = ?');
    params.push(filter.callId);
  }
  if (filter.status) {
    conditions.push('status = ?');
    params.push(filter.status);
  }
  if (conditions.length > 0) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }
  const [rows] = await pool.query(sql, params);
 return rows.map(row => ({
    ...row,
    id: row.chavrutaId
  }));
};

// יצירת חברותא חדשה
export const create = async (chavruta) => {
  const sql = `INSERT INTO CHAVRUTA (user1, user2, callId, status, notesUser1, notesUser2)
    VALUES (?, ?, ?, ?, ?, ?)`;
  const params = [
    chavruta.user1,
    chavruta.user2,
    chavruta.callId ?? null,
    chavruta.status ?? 'active',
    chavruta.notesUser1 ?? null,
    chavruta.notesUser2 ?? null
  ];
  const [result] = await pool.query(sql, params);
  return { id: result.insertId, ...chavruta };
};

// עדכון חברותא קיימת
export const update = async (chavrutaId, chavruta) => {
  const fields = [];
  const params = [];
  for (const key of ['user1', 'user2', 'callId', 'status', 'notesUser1', 'notesUser2']) {
    if (chavruta[key] !== undefined) {
      fields.push(`${key} = ?`);
      params.push(chavruta[key]);
    }
  }
  if (fields.length === 0) return null;
  params.push(chavrutaId);
  const sql = `UPDATE CHAVRUTA SET ${fields.join(', ')} WHERE chavrutaId = ?`;
  const [result] = await pool.query(sql, params);
  return { id: result.insertId, ...result };
}; 

// מחיקת חברותא
export const deleteChavruta = async (chavrutaId) => {
  const sql = 'DELETE FROM CHAVRUTA WHERE chavrutaId = ?';
  const [result] = await pool.query(sql, [chavrutaId]);
  return result;
};