import pool from './DB.js';
import { handleCallCreation } from '../services/callService.js';
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

export const getById = async (callId) => {
  const sql = 'SELECT * FROM CALLS WHERE callId = ?';
  const [rows] = await pool.query(sql, [callId]);
  if (rows.length === 0) return null;
  const row = rows[0];
  return { ...row, id: row.callId };
};

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
   return rows.map(row => ({
    ...row,
    id: row.callId
  }));
};



export const create = async (call) => {
  const sql = `INSERT INTO CALLS (userId, targetUserId, place, learningFormat, time, subject, ageRange, notes, preferredDuration, material, isActive)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const params = [
    call.userId,
    call.targetUserId || null,
    call.place,
    call.learningFormat,
    call.time,
    call.subject,
    call.ageRange,
    call.notes,
    call.preferredDuration,
    call.material,
    call.isActive !== undefined ? call.isActive : true
  ];
  const [result] = await pool.query(sql, params);
  return { ...call, id: result.insertId };
};


export const update = async (callId, call) => {
  const fields = [];
  const params = [];
for (const key of ['userId', 'targetUserId', 'place', 'learningFormat', 'time', 'subject', 'ageRange', 'notes', 'preferredDuration', 'material', 'isActive']) {    if (call[key] !== undefined) {
      fields.push(`${key} = ?`);
      params.push(call[key]);
    }
  }
  if (fields.length === 0) return null;
  params.push(callId);
  const sql = `UPDATE CALLS SET ${fields.join(', ')} WHERE callId = ?`;
  const [result] = await pool.query(sql, params);
   return { id: callId, ...call };
};

export const deleteCall = async (callId) => {
  const sql = 'DELETE FROM CALLS WHERE callId = ?';
  const [result] = await pool.query(sql, [callId]);
  return result;
};