import pool from './DB.js';

// קבלת חברותות עם סינון
export const findByFilter = async (filter = {}) => {
  let sql = 'SELECT * FROM CHAVRUTA';
  const params = [];
  const conditions = [];
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
  if (conditions.length > 0) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }
  const [rows] = await pool.query(sql, params);
  return rows;
};

export const create = async (chavruta) => {
  const sql = `INSERT INTO CHAVRUTA (user1, user2, callId)
    VALUES (?, ?, ?)`;
  const params = [
    chavruta.user1, chavruta.user2, chavruta.callId
  ];
  const [result] = await pool.query(sql, params);
  return { chavrutaId: result.insertId, ...chavruta };
};

export const update = async (chavrutaId, chavruta) => {
  const fields = [];
  const params = [];
  for (const key of ['user1', 'user2', 'callId']) {
    if (chavruta[key] !== undefined) {
      fields.push(`${key} = ?`);
      params.push(chavruta[key]);
    }
  }
  if (fields.length === 0) return null;
  params.push(chavrutaId);
  const sql = `UPDATE CHAVRUTA SET ${fields.join(', ')} WHERE chavrutaId = ?`;
  const [result] = await pool.query(sql, params);
  return result;
};

export const deleteChavruta = async (chavrutaId) => {
  const sql = 'DELETE FROM CHAVRUTA WHERE chavrutaId = ?';
  const [result] = await pool.query(sql, [chavrutaId]);
  return result;
};