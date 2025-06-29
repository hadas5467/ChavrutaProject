import pool from './DB.js';



// קבלת חברותות עם סינון
// export const findByFilter = async (filter = {}) => {
//   let sql = `SELECT c.*,
//   u1.userId as user1_id, u1.name as user1_name, u1.profile as user1_profile,
//   u2.userId as user2_id, u2.name as user2_name, u2.profile as user2_profile
//   FROM CHAVRUTA c
//   LEFT JOIN USERS u1 ON c.user1 = u1.userId
//   LEFT JOIN USERS u2 ON c.user2 = u2.userId
//   `;
//   const params = [];
//   const conditions = [];
//   if (filter.chavrutaId) {
//     conditions.push('c.chavrutaId = ?');
//     params.push(filter.chavrutaId);
//   }
//   if (filter.userId) {
//     conditions.push('(c.user1 = ? OR c.user2 = ?)');
//     params.push(filter.userId, filter.userId);
//   }
//   if (filter.user1) {
//     conditions.push('c.user1 = ?');
//     params.push(filter.user1);
//   }
//   if (filter.user2) {
//     conditions.push('c.user2 = ?');
//     params.push(filter.user2);
//   }
//   if (filter.callId) {
//     conditions.push('c.callId = ?');
//     params.push(filter.callId);
//   }
//   if (filter.status) {
//     conditions.push('c.status = ?');
//     params.push(filter.status);
//   }
//   if (conditions.length > 0) {
//     sql += ' WHERE ' + conditions.join(' AND ');
//   }
//   const [rows] = await pool.query(sql, params);
//   return rows.map(row => ({
//     ...row,
//     id: row.chavrutaId,
//     user1: {
//       id: row.user1_id,
//       name: row.user1_name,
//       profile: row.user1_profile
//     },
//     user2: {
//       id: row.user2_id,
//       name: row.user2_name,
//       profile: row.user2_profile
//     }
//   }));
// };
export const getChavrutaById = async (chavrutaId) => {
  const sql = `
    SELECT 
      c.*,
      -- נתוני משתמש 1
      u1.userId as user1_id, u1.name as user1_name, u1.profile as user1_profile,
      u1.phone as user1_phone, u1.gmail as user1_gmail, u1.age as user1_age, u1.sector as user1_sector, u1.languages as user1_languages,
      -- נתוני משתמש 2
      u2.userId as user2_id, u2.name as user2_name, u2.profile as user2_profile,
      u2.phone as user2_phone, u2.gmail as user2_gmail, u2.age as user2_age, u2.sector as user2_sector, u2.languages as user2_languages,
      -- נתוני הקריאה
      calls.place as call_place,
      calls.material as call_material,
      calls.subject as call_subject,
      calls.time as call_time,
      calls.preferredDuration as call_preferredDuration,
      calls.ageRange as call_ageRange,
      calls.notes as call_notes,
      calls.learningFormat as call_learningFormat
    FROM CHAVRUTA c
    INNER JOIN USERS u1 ON c.user1 = u1.userId
    INNER JOIN USERS u2 ON c.user2 = u2.userId
    INNER JOIN CALLS calls ON c.callId = calls.callId
    WHERE c.chavrutaId = ?
  `;

  const [rows] = await pool.query(sql, [chavrutaId]);
  if (rows.length === 0) return null;

  const row = rows[0];
  return {
    chavrutaId: row.chavrutaId,
    user1: {
      id: row.user1_id,
      name: row.user1_name,
      profile: row.user1_profile,
      phone: row.user1_phone,
      gmail: row.user1_gmail,
      age: row.user1_age,
      sector: row.user1_sector,
      languages: row.user1_languages
    },
    user2: {
      id: row.user2_id,
      name: row.user2_name,
      profile: row.user2_profile,
      phone: row.user2_phone,
      gmail: row.user2_gmail,
      age: row.user2_age,
      sector: row.user2_sector,
      languages: row.user2_languages
    },
    call: {
      place: row.call_place,
      material: row.call_material,
      subject: row.call_subject,
      time: row.call_time,
      preferredDuration: row.call_preferredDuration,
      ageRange: row.call_ageRange,
      notes: row.call_notes,
      learningFormat: row.call_learningFormat
    },
    createdAt: row.createdAt,
    notesUser1: row.notesUser1,
    notesUser2: row.notesUser2,
    status: row.status
  };
};

export const findByFilter = async (filter = {}) => {
let sql = `
  SELECT 
    c.*,
    -- נתוני משתמש 1
    u1.userId as user1_id, u1.name as user1_name, u1.profile as user1_profile,
    u1.phone as user1_phone, u1.gmail as user1_gmail, u1.age as user1_age, u1.sector as user1_sector, u1.languages as user1_languages,
    -- נתוני משתמש 2
    u2.userId as user2_id, u2.name as user2_name, u2.profile as user2_profile,
    u2.phone as user2_phone, u2.gmail as user2_gmail, u2.age as user2_age, u2.sector as user2_sector, u2.languages as user2_languages,
    -- נתוני הקריאה
    calls.place as call_place,
    calls.material as call_material,
    calls.subject as call_subject
  FROM CHAVRUTA c
  INNER JOIN USERS u1 ON c.user1 = u1.userId
  INNER JOIN USERS u2 ON c.user2 = u2.userId
  INNER JOIN CALLS calls ON c.callId = calls.callId
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
  if (filter.userSearch) {
    conditions.push('(u1.name LIKE ? OR u2.name LIKE ?)');
    const searchTerm = `%${filter.userSearch}%`;
    params.push(searchTerm, searchTerm);
  }
  
  // חיפוש בנושא או חומרים
  if (filter.subjectSearch) {
    conditions.push('(calls.subject LIKE ? OR calls.material LIKE ?)');
    const searchTerm = `%${filter.subjectSearch}%`;
    params.push(searchTerm, searchTerm);
  }
  
  // סינון לפי תאריך יצירה
  if (filter.startDate) {
    conditions.push('c.startedAt >= ?');
    params.push(filter.startDate);
  }
  if (filter.endDate) {
    conditions.push('c.startedAt <= ?');
    params.push(filter.endDate);
  }
  
  // חיפוש כללי (לשמירה על תאימות לאחור)
  if (filter.search) {
    conditions.push('(u1.name LIKE ? OR u2.name LIKE ? OR calls.subject LIKE ? OR calls.material LIKE ?)');
    const searchTerm = `%${filter.search}%`;
    params.push(searchTerm, searchTerm, searchTerm, searchTerm);
  }
  
  // הוספת WHERE רק אם יש תנאים
  if (conditions.length > 0) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }
    // מיון
  const allowedSortBy = {
  callCreatedAt: 'c.startedAt',
  callTime: 'c.time',
  callId: 'c.chavrutaId',
  user1Name: 'u1.name',
  user2Name: 'u2.name',
  subject: 'c.subject',
};

const safeSortBy = allowedSortBy[filter.sortBy];
  if (safeSortBy) {
    sql += ` ORDER BY ${safeSortBy} ${filter.sortOrder=== 'DESC' ? 'DESC' : 'ASC'}`;
  } else {
    sql += ' ORDER BY c.startedAt DESC'; 
  }
  
  const [rows] = await pool.query(sql, params);
  return rows.map(row => ({
    ...row,
     id: row.chavrutaId, 
    user1: {
      id: row.user1_id,
      name: row.user1_name,
      profile: row.user1_profile,
      description: row.user1_description,
      phone: row.user1_phone,
      gmail: row.user1_gmail,
      age: row.user1_age,
      sector: row.user1_sector,
      languages: row.user1_languages
    },
    user2: {
      id: row.user2_id,
      name: row.user2_name,
      profile: row.user2_profile,
      description: row.user2_description,
      phone: row.user2_phone,
      gmail: row.user2_gmail,
      age: row.user2_age,
      sector: row.user2_sector,
      languages: row.user2_languages
    },
    call: {
      place: row.call_place,
      material: row.call_material,
      subject: row.call_subject,
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