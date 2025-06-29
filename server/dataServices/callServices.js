import pool from './DB.js';
import { handleCallCreation } from '../services/callService.js';

export const getCallWithUser = async (callId, userSex) => {
  const sql = `
    SELECT 
      c.*,
      u.userId               AS senderId,
      u.name                 AS senderName,
      u.profile              AS senderProfile,
      u.sex                  AS senderSex,
      u.age                  AS senderAge,
      u.sector               AS senderSector,
      u.experienceLevel      AS senderExperienceLevel,
      u.city                 AS senderCity,
      u.country              AS senderCountry,
      u.bio                  AS senderBio,
      u.tags                 AS senderTags
    FROM CALL_RECIPIENTS cr
    INNER JOIN CALLS c ON cr.callId = c.callId
    INNER JOIN USERS u ON c.userId = u.userId
    WHERE cr.targetUserId = ?
      AND c.isActive = TRUE
    ORDER BY c.createdAt DESC
  `;
  const [rows] = await pool.query(sql, [callId]); // תיקון: callId במקום recipientId
  return rows.map(row => ({
    id: row.callId,
    ...row,
    sender: {
      userId:            row.senderId,
      name:              row.senderName,
      profile:           row.senderProfile,
      sex:               row.senderSex,
      age:               row.senderAge,
      sector:            row.senderSector,
      experienceLevel:   row.senderExperienceLevel,
      city:              row.senderCity,
      country:           row.senderCountry,
      bio:               row.senderBio,
      tags:              row.senderTags
    }
  }));
};

export const getById = async (callId) => {
  const sql = 'SELECT * FROM CALLS WHERE callId = ?';
  const [rows] = await pool.query(sql, [callId]);
  if (rows.length === 0) return null;
  const row = rows[0];
  return { ...row, id: row.callId };
};

export const getIsCallRecipients = async (callId, userId) => {
   const sql =  'SELECT 1 FROM CALL_RECIPIENTS WHERE callId = ? AND targetUserId = ?';
  const result = await pool.query(sql,   [callId, userId]);
  return result;
};
export const findByFilter = async (filter = {}) => {
  let sql = `
    SELECT 
      c.*,
      u.userId               AS senderId,
      u.name                 AS senderName,
      u.profile              AS senderProfile,
      u.sex                  AS senderSex,
      u.age                  AS senderAge,
      u.sector               AS senderSector,
      u.experienceLevel      AS senderExperienceLevel,
      u.city                 AS senderCity,
      u.country              AS senderCountry,
      u.bio                  AS senderBio,
      u.tags                 AS senderTags
    FROM CALL_RECIPIENTS cr
    INNER JOIN CALLS c ON cr.callId = c.callId
    INNER JOIN USERS u ON c.userId = u.userId
    WHERE c.isActive = 1
  `;
  
  const params = [];
  
  if (filter.sex) {
    sql += ' AND u.sex = ?';
    params.push(filter.sex);
  }
  if (filter.targetUserId) {
    sql += ' AND cr.targetUserId = ?'; // תיקון: cr.targetUserId במקום c.targetUserId
    params.push(filter.targetUserId);
  }
  // הוספת פילטרים נוספים
  if (filter.userId) {
    sql += ' AND c.userId = ?';
    params.push(filter.userId);
  }
  if (filter.place) {
    sql += ' AND c.place = ?';
    params.push(filter.place);
  }
  if (filter.learningFormat) {
    sql += ' AND c.learningFormat = ?';
    params.push(filter.learningFormat);
  }
  if (filter.subject) {
    sql += ' AND c.subject = ?';
    params.push(filter.subject);
  }
  if (filter.ageRange) {
    sql += ' AND c.ageRange = ?';
    params.push(filter.ageRange);
  }
  if (filter.isActive !== undefined) {
    sql += ' AND c.isActive = ?';
    params.push(filter.isActive);
  }
  if (filter.callId !== undefined) {
    sql += ' AND c.callId = ?';
    params.push(filter.callId);
  }
   // חיפוש לפי שם משתמש (שולח הקריאה)
  if (filter.userSearch) {
    sql += ' AND u.name LIKE ?';
    const searchTerm = `%${filter.userSearch}%`;
    params.push(searchTerm);
  }
  
  // חיפוש בנושא או חומרים
  if (filter.subjectSearch) {
    sql += ' AND (c.subject LIKE ? OR c.material LIKE ?)';
    const searchTerm = `%${filter.subjectSearch}%`;
    params.push(searchTerm, searchTerm);
  }
  
  // סינון לפי תאריך יצירה
  if (filter.startDate) {
    sql += ' AND c.createdAt >= ?';
    params.push(filter.startDate);
  }
  if (filter.endDate) {
    sql += ' AND c.createdAt <= ?';
    params.push(filter.endDate);
  }
    if (filter.search) {
    sql += ' AND (u.name LIKE ? OR c.subject LIKE ? OR c.material LIKE ? OR c.notes LIKE ?)';
    const searchTerm = `%${filter.search}%`;
    params.push(searchTerm, searchTerm, searchTerm, searchTerm);
  }
  
  // מיון
  if (filter.sortBy) {
    sql += ` ORDER BY ${filter.sortBy} ${filter.sortOrder || 'ASC'}`;
  } else {
    sql += ' ORDER BY c.createdAt DESC'; // ברירת מחדל - החדשות ביותר קודם
  }
  
  
  const [rows] = await pool.query(sql, params);
  return rows.map(row => ({
    id: row.callId,
    ...row,
    sender: {
      userId:            row.senderId,
      name:              row.senderName,
      profile:           row.senderProfile,
      sex:               row.senderSex,
      age:               row.senderAge,
      sector:            row.senderSector,
      experienceLevel:   row.senderExperienceLevel,
      city:              row.senderCity,
      country:           row.senderCountry,
      bio:               row.senderBio,
      tags:              row.senderTags
    }
  }));
};

export const create = async (call) => {
  const sql = `
    INSERT INTO CALLS (userId, targetUserId, place, learningFormat, time, subject, ageRange, notes, preferredDuration, material, isActive)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
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



export const createCallRecipients = async (callId, userId,targetUserId) => {
  const sql = `INSERT INTO CALL_RECIPIENTS (callId, userId, targetUserId) VALUES (?, ?, ?)
  `;
 const params= [callId, userId, targetUserId];
  const [result] = await pool.query(sql, params);
  return result;
};

export const update = async (callId, call) => {
  const fields = [];
  const params = [];
  
  for (const key of ['userId', 'targetUserId', 'place', 'learningFormat', 'time', 'subject', 'ageRange', 'notes', 'preferredDuration', 'material', 'isActive']) {
    if (call[key] !== undefined) {
      fields.push(`${key} = ?`); // תיקון: backticks
      params.push(call[key]);
    }
  }
  
  if (fields.length === 0) return null;
  params.push(callId);
  
  const sql = `UPDATE CALLS SET ${fields.join(', ')} WHERE callId = ?`; // תיקון: backticks
  const [result] = await pool.query(sql, params);
  return { id: callId, ...call };
};