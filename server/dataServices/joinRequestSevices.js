import pool from './DB.js';
export const getCallCreatorByJoinRequestId = async (joinRequestId) => {
  const [rows] = await pool.query(`
SELECT 
  jr.userId AS creatorId,
  u.name AS creatorName,
  u.gmail AS creatorEmail,
  u.contactMethod,
  jr.details,
  c.callId
FROM JOIN_REQUESTS jr
JOIN CALLS c ON jr.callId = c.callId
JOIN USERS u ON jr.userId = u.userId
WHERE jr.joinRequestId = ?

  `, [joinRequestId]);

  return rows[0];
};


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
   if (filter.targetUserId) {
    conditions.push('targetUserId = ?');
    params.push(filter.targetUserId);
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
  const sql = `INSERT INTO JOIN_REQUESTS (callId, userId, targetUserId, details, status)
    VALUES (?, ?, ?, ?, ?)`;
  const params = [
    joinRequest.callId,
    joinRequest.userId,
    joinRequest.targetUserId,
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
  console.log('Updating join request:', joinRequestId, joinRequest, fields, params);
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

export const updateByCallAndUser = async ({ callId, userId }, updateFields) => {
  const fields = [];
  const params = [];
  for (const key of ['callId', 'userId', 'details', 'status']) {
    if (updateFields[key] !== undefined) {
      fields.push(`${key} = ?`);
      params.push(updateFields[key]);
    }
  }
  if (fields.length === 0) return null;
  params.push(callId, userId);
  const sql = `UPDATE JOIN_REQUESTS SET ${fields.join(', ')} WHERE callId = ? AND userId = ?`;
  const [result] = await pool.query(sql, params);
  return result;
};