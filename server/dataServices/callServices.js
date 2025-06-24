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
  if (filter.learningFormat) {
    conditions.push('learningFormat = ?');
    params.push(filter.learningFormat);
  }
  if (filter.subject) {
    conditions.push('subject = ?');
    params.push(filter.subject);
  }
  if (filter.ageRange) {
    conditions.push('ageRange = ?');
    params.push(filter.ageRange);
  }
  if (filter.isActive !== undefined) {
    conditions.push('isActive = ?');
    params.push(filter.isActive);
  }
  if (filter.callId !== undefined) {
    conditions.push('callId = ?');
    params.push(filter.callId);
  }
  if (conditions.length > 0) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }
  const [rows] = await pool.query(sql, params);
  return rows;
};

export const create = async (call) => {
  const sql = `INSERT INTO CALLS (userId, place, learningFormat, time, subject, ageRange, notes, material)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  const params = [
    call.userId,
    call.place,
    call.learningFormat,
    call.time,
    call.subject,
    call.ageRange,
    call.notes,
    call.material
  ];
  const [result] = await pool.query(sql, params);
  return { id: result.insertId, ...call };
};

export const update = async (callId, call) => {
  const fields = [];
  const params = [];
  for (const key of ['userId', 'place', 'learningFormat', 'time', 'subject', 'ageRange', 'notes', 'material', 'isActive']) {
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