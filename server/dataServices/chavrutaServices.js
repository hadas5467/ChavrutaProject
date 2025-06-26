import pool from './DB.js';



// קבלת חברותות עם סינון
export const findByFilter = async (filter = {}) => {
  let sql = `SELECT c.*,
  u1.userId as user1_id, u1.name as user1_name, u1.profile as user1_profile,
  u2.userId as user2_id, u2.name as user2_name, u2.profile as user2_profile
  FROM CHAVRUTA c
  LEFT JOIN USERS u1 ON c.user1 = u1.userId
  LEFT JOIN USERS u2 ON c.user2 = u2.userId
  `;
  const params = [];
  const conditions = [];
  if (filter.chavrutaId) {
    conditions.push('c.chavrutaId = ?');
    params.push(filter.chavrutaId);
  }
  if (filter.userId) {
    conditions.push('(c.user1 = ? OR c.user2 = ?)');
    params.push(filter.userId, filter.userId);
  }
  if (filter.user1) {
    conditions.push('c.user1 = ?');
    params.push(filter.user1);
  }
  if (filter.user2) {
    conditions.push('c.user2 = ?');
    params.push(filter.user2);
  }
  if (filter.callId) {
    conditions.push('c.callId = ?');
    params.push(filter.callId);
  }
  if (filter.status) {
    conditions.push('c.status = ?');
    params.push(filter.status);
  }
  if (conditions.length > 0) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }
  const [rows] = await pool.query(sql, params);
  return rows.map(row => ({
    ...row,
    id: row.chavrutaId,
    user1: {
      id: row.user1_id,
      name: row.user1_name,
      profile: row.user1_profile
    },
    user2: {
      id: row.user2_id,
      name: row.user2_name,
      profile: row.user2_profile
    }
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