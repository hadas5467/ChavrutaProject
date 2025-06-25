import pool from './DB.js';

// קבלת בקשות הצטרפות עם סינון
export const findByFilter = async (filter = {}) => {
  let sql = 'SELECT * FROM JOIN_REQUESTS';
  const params = [];
  const conditions = [];
  if (filter.joinRequestId) {
    conditions.push('joinRequestId = ?');
    params.push(filter.joinRequestId);
  }
  if (filter.callId) {
    conditions.push('callId = ?');
    params.push(filter.callId);
  }
  if (filter.userId) {
    conditions.push('userId = ?');
    params.push(filter.userId);
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
    id: row.joinRequestId
  }));
};

// יצירת בקשת הצטרפות חדשה
export const create = async (joinRequest) => {
  const sql = `INSERT INTO JOIN_REQUESTS (callId, userId, details, status)
    VALUES (?, ?, ?, ?)`;
  const params = [
    joinRequest.callId,
    joinRequest.userId,
    joinRequest.details ?? null,
    joinRequest.status ?? 'pending'
  ];
  const [result] = await pool.query(sql, params);
  return { id: result.insertId, ...joinRequest };
};

// עדכון בקשת הצטרפות
export const update = async (joinRequestId, joinRequest) => {
  const fields = [];
  const params = [];
  for (const key of ['callId', 'userId', 'details', 'status']) {
    if (joinRequest[key] !== undefined) {
      fields.push(`${key} = ?`);
      params.push(joinRequest[key]);
    }
  }
  if (fields.length === 0) return null;
  params.push(joinRequestId);
  const sql = `UPDATE JOIN_REQUESTS SET ${fields.join(', ')} WHERE joinRequestId = ?`;
  const [result] = await pool.query(sql, params);
  return { id: joinRequestId, ...joinRequest };
};

// מחיקת בקשת הצטרפות
export const deleteJoinRequest = async (joinRequestId) => {
  const sql = 'DELETE FROM JOIN_REQUESTS WHERE joinRequestId = ?';
  const [result] = await pool.query(sql, [joinRequestId]);
  return result;
};