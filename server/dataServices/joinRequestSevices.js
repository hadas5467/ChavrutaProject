import pool from './DB.js';
export const getCallCreatorByJoinRequestId = async (joinRequestId, connection = pool) => {
  const [rows] = await connection.query(`
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
export const findByFilter = async (filter = {}, connection = pool) => {
  let sql = `
    SELECT 
      jr.*,
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
      u.tags                 AS senderTags,
      c.time                 AS callTime,
      c.subject              AS callSubject,
      c.material             AS callMaterial,
      c.createdAt            AS callCreatedAt
    FROM JOIN_REQUESTS jr
    INNER JOIN USERS u ON jr.userId = u.userId
     INNER JOIN CALLS c ON jr.callId = c.callId
  `;

  const params = [];
  const conditions = [];
  if (filter.joinRequestId) {
    conditions.push('jr.joinRequestId = ?');
    params.push(filter.joinRequestId);
  }
  if (filter.callId) {
    conditions.push('jr.callId = ?');
    params.push(filter.callId);
  }
  if (filter.userId) {
    conditions.push('jr.userId = ?');
    params.push(filter.userId);
  }
  if (filter.status) {
    conditions.push('jr.status = ?');
    params.push(filter.status);
  }
  if (filter.targetUserId) {
    conditions.push('jr.targetUserId = ?');
    params.push(filter.targetUserId);
  }
  if (filter.search) {
    conditions.push('(u.name LIKE ? OR jr.details LIKE ? OR c.subject LIKE ? OR c.material LIKE ?)');
    const searchTerm = `%${filter.search}%`;
    params.push(searchTerm, searchTerm, searchTerm, searchTerm);
  }
    if (filter.userSearch) {
    sql += ' AND u.name LIKE ?';
    const searchTerm = `%${filter.userSearch}%`;
    params.push(searchTerm);
  }
  if (filter.startDate) {
    conditions.push('c.createdAt >= ?');
    params.push(filter.startDate);
  }
  if (filter.endDate) {
    conditions.push('c.createdAt <= ?');
    params.push(filter.endDate);
  }
  if (filter.subject) {
    conditions.push('c.subject = ?');
    params.push(filter.subject);
  }

  // סינון לפי פורמט למידה
  if (filter.learningFormat) {
    conditions.push('c.learningFormat = ?');
    params.push(filter.learningFormat);
  }

  // סינון לפי מיקום
  if (filter.place) {
    conditions.push('c.place = ?');
    params.push(filter.place);
  }
  if (conditions.length > 0) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }
  if (filter.sortBy) {
    const validSortColumns = ['c.createdAt', 'jr.status', 'jr.joinRequestId'];
    if (filter.sortBy && validSortColumns.includes(filter.sortBy)) {
      sql += ` ORDER BY ${filter.sortBy} ${filter.sortOrder || 'ASC'}`;
    }
  } else {
    sql += ' ORDER BY c.createdAt DESC'; // ברירת מחדל - החדשות ביותר קודם
  }
  const [rows] = await pool.query(sql, params);
  return rows.map(row => ({
    id: row.joinRequestId,
    ...row,
    sender: {
      userId: row.senderId,
      name: row.senderName,
      profile: row.senderProfile,
      sex: row.senderSex,
      age: row.senderAge,
      sector: row.senderSector,
      experienceLevel: row.senderExperienceLevel,
      city: row.senderCity,
      country: row.senderCountry,
      bio: row.senderBio,
      tags: row.senderTags
    },
    call: {
      callId: row.callId,
      place: row.callPlace,
      learningFormat: row.callLearningFormat,
      time: row.callTime,
      subject: row.callSubject,
      ageRange: row.callAgeRange,
      notes: row.callNotes,
      preferredDuration: row.callPreferredDuration,
      material: row.callMaterial,
      createdAt: row.callCreatedAt,
      isActive: row.callIsActive
    }
  }));
};

// יצירת בקשת הצטרפות חדשה
export const create = async (joinRequest, connection = pool) => {
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
export const update = async (joinRequestId, joinRequest, connection = pool) => {
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
export const deleteJoinRequest = async (joinRequestId, connection = pool) => {
  const sql = 'DELETE FROM JOIN_REQUESTS WHERE joinRequestId = ?';
  const [result] = await connection.query(sql, [joinRequestId]);
  return result;
};

export const updateByCallAndUser = async ({ callId, userId }, updateFields, connection = pool) => {
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