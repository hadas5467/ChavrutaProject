import pool from './DB.js';

// קבלת שיחות עם סינון
export const findByFilter = async (filter = {}) => {
  let sql = 'SELECT * FROM CALLS';
  const params = [];
  const conditions = [];
  if (filter.userId) {
    conditions.push('userId = ?');
    params.push(filter.userId);
  }
  if (filter.place) {
    conditions.push('place = ?');
    params.push(filter.place);
  }
  if (conditions.length > 0) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }
  const [rows] = await pool.query(sql, params);
  return rows;
};

export const create = async (call) => {
  const sql = `INSERT INTO CALLS (userId, place, learningFormat, time, subject, age, notes, material)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  const params = [
    call.userId, call.place, call.learningFormat, call.time,
    call.subject, call.age, call.notes, call.material
  ];
  const [result] = await pool.query(sql, params);
  return { callId: result.insertId, ...call };
};

export const update = async (callId, call) => {
  const fields = [];
  const params = [];
  for (const key of ['userId', 'place', 'learningFormat', 'time', 'subject', 'age', 'notes', 'material']) {
    if (call[key] !== undefined) {
      fields.push(`${key} = ?`);
      params.push(call[key]);
    }
  }
  if (fields.length === 0) return null;
  params.push(callId);
  const sql = `UPDATE CALLS SET ${fields.join(', ')} WHERE callId = ?`;
  const [result] = await pool.query(sql, params);
  return result;
};

export const deleteCall = async (callId) => {
  const sql = 'DELETE FROM CALLS WHERE callId = ?';
  const [result] = await pool.query(sql, [callId]);
  return result;
};