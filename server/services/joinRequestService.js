// import { getById } from '../dataServices/userServices.js';
// import { sendEmail } from '../utils/notifications.js';
// import { create,getCallCreatorByJoinRequestId } from '..//dataServices/joinRequestSevices.js';

// export const handleJoinRequest = async (joinData) => {
//   const { callId, id, targetUserId, details } = joinData;
//   const user = await getById(targetUserId);
//   if (!user) throw new Error('Target user not found');

//   const request = await create(joinData);

//   // if (user.contactMethod === 'email') {
//   //   const subject = '📩 בקשת הצטרפות חדשה לחברותא';
//   //   const message = `שלום ${user.name},\n\nיש בקשת הצטרפות חדשה לקריאה שלך (שיחה מספר ${callId}):\n"${details}"\n\nהיכנס למערכת כדי לאשר או לדחות.`;
//   //   await sendEmail(user.gmail, subject, message);
//   // }
// if (user.contactMethod === 'email') {
//     const subject = '📩 בקשת הצטרפות חדשה לחברותא';
//     const message = `שלום ${user.name},\n\nיש בקשת הצטרפות חדשה לקריאה שלך (שיחה מספר ${callId}):\n"${details}"\n\nהיכנס למערכת כדי לאשר או לדחות.`;
//     try {
//       await sendEmail(user.gmail, subject, message);
//     } catch (error) {
//       console.error('שגיאה בשליחת מייל:', error.message, error);
//       // אפשר גם להוסיף לוגיקה לדיווח או שמירה במסד נתונים אם תרצי
//     }
//   }
//   return request;
// };

// export const handleJoinRequestDelete = async (id) => {
  
//   const user = await getCallCreatorByJoinRequestId(id);
//   if (!user) {
//     console.error('User not found for join request ID:', id);
//     throw new Error('Target user not found');
//   }

// console.log('User found:', user);

  
  

//   console.log('Join request deleted successfully:', id);

//   // שליחת מייל למשתמש אם הוא בחר באפשרות זו
// if (user.contactMethod === 'email') {
//     const subject = '❗ עדכון על בקשת החברותא שלך';
// const message = `שלום ${user.creatorName},

// לצערנו, בקשתך להצטרף לשיחה (קריאה מספר ${user.callId}) לא אושרה.

// 📋 פרטי הקריאה:
// "${user.details}"

// תוכל לבדוק קריאות נוספות המתאימות לך במערכת, או ליצור קריאה חדשה משלך.

// בהצלחה רבה בדרך ללימוד משמעותי,
// צוות חברותא.
// `;
//     try {
//       await sendEmail(user.creatorEmail, subject, message);
//     } catch (error) {
//       console.error('שגיאה בשליחת מייל:', error.message, error);
//       // אפשר גם להוסיף לוגיקה לדיווח או שמירה במסד נתונים אם תרצי
//     }
//   }
 
// };


import pool from '../dataServices/DB.js';
import { getById } from '../dataServices/userServices.js';
import { sendEmail } from '../utils/notifications.js';
import {
  create,
  getCallCreatorByJoinRequestId,
  findByFilter,
  deleteJoinRequest
} from '../dataServices/joinRequestSevices.js';

import { handleChavrutaCreation } from './chavrutaService.js';

/**
 * יצירת בקשת הצטרפות רגילה
 */
export const handleJoinRequest = async (joinData) => {
  const { callId, id, targetUserId, details } = joinData;
  const user = await getById(targetUserId);
  if (!user) throw new Error('Target user not found');

  const request = await create(joinData);

  if (user.contactMethod === 'email') {
    const subject = '📩 בקשת הצטרפות חדשה לחברותא';
    const message = `שלום ${user.name},\n\nיש בקשת הצטרפות חדשה לקריאה שלך (שיחה מספר ${callId}):\n"${details}"\n\nהיכנס למערכת כדי לאשר או לדחות.`;
    try {
      await sendEmail(user.gmail, subject, message);
    } catch (error) {
      console.error('שגיאה בשליחת מייל:', error.message, error);
    }
  }

  return request;
};

/**
 * מחיקת בקשת הצטרפות קיימת + מייל
 */
// export const handleJoinRequestDelete = async (id) => {
//   const user = await getCallCreatorByJoinRequestId(id);
//   if (!user) {
//     console.error('User not found for join request ID:', id);
//     throw new Error('Target user not found');
//   }

//   console.log('Join request deleted successfully:', id);

//   if (user.contactMethod === 'email') {
//     const subject = '❗ עדכון על בקשת החברותא שלך';
//     const message = `שלום ${user.creatorName},

// לצערנו, בקשתך להצטרף לשיחה (קריאה מספר ${user.callId}) לא אושרה.

// 📋 פרטי הקריאה:
// "${user.details}"

// תוכל לבדוק קריאות נוספות המתאימות לך במערכת, או ליצור קריאה חדשה משלך.

// בהצלחה רבה בדרך ללימוד משמעותי,
// צוות חברותא.
// `;
//     try {
//       await sendEmail(user.creatorEmail, subject, message);
//     } catch (error) {
//       console.error('שגיאה בשליחת מייל:', error.message, error);
//     }
//   }
// };

export const handleJoinRequestDelete = async (id, connection = pool) => {
  const user = await getCallCreatorByJoinRequestId(id, connection);
  if (!user) {
    console.error('User not found for join request ID:', id);
    throw new Error('Target user not found');
  }

  const result = await deleteJoinRequest(id, connection);
  console.log('Join request deleted successfully:', id);

  if (user.contactMethod === 'email') {
    const subject = '❗ עדכון על בקשת החברותא שלך';
    const message = `שלום ${user.creatorName},

לצערנו, בקשתך להצטרף לשיחה (קריאה מספר ${user.callId}) לא אושרה.

📋 פרטי הקריאה:
"${user.details}"

תוכל לבדוק קריאות נוספות המתאימות לך במערכת, או ליצור קריאה חדשה משלך.

בהצלחה רבה בדרך ללימוד משמעותי,
צוות חברותא.
`;
    try {
      await sendEmail(user.creatorEmail, subject, message);
    } catch (error) {
      console.error('שגיאה בשליחת מייל:', error.message, error);
    }
  }

  return result;
};

/**
 * אישור בקשת הצטרפות ליצירת חברותא:
 * - יוצר חברותא עם handleChavrutaCreation
 * - מוחק את כל שאר הבקשות לאותה קריאה
 * - הכל בתוך טרנזקציה
 */
// export const approveJoinRequest = async ({ user1, user2, callId }) => {
//   const connection = await pool.getConnection();
//   try {
//     await connection.beginTransaction();

//     // יצירת חברותא ועדכון סטטוס (כולל מיילים)
//     await handleChavrutaCreation({ user1, user2, callId }, connection);

//     // מחיקת שאר הבקשות לאותה קריאה
//     const requests = await findByFilter({ callId }, connection);
//     for (const req of requests) {
//       await deleteJoinRequest(req.joinRequestId, connection);
 
//     }

//     await connection.commit();
//     return { success: true };
//   } catch (error) {
//     await connection.rollback();
//     console.error('approveJoinRequest error:', error.message, error);
//     throw error;
//   } finally {
//     connection.release();
//   }
// };


export const approveJoinRequest = async ({ user1, user2, callId }) => {
  const connection = await pool.getConnection();
  const deletedIds = []; // נאסוף את המזהים של הבקשות שנמחקו כדי לשלוח מייל אחר כך

  try {
    await connection.beginTransaction();

    // יצירת חברותא (כולל עדכון סטטוס ושליחת מיילים למאושרים)
    await handleChavrutaCreation({ user1, user2, callId }, connection);

    // שליפת כל הבקשות לאותה קריאה (כולל זאת שאושרה)
    const requests = await findByFilter({ callId }, connection);

    // מחיקת כל הבקשות (כולל את שאושרה – גם היא תימחק כי החברותא נוצרה)
    for (const req of requests) {
      await handleJoinRequestDelete(req.joinRequestId, connection); // ✔️ מחיקה + מייל
    }

    await connection.commit();

    return { success: true };
  } catch (error) {
    await connection.rollback();
    console.error('approveJoinRequest error:', error.message, error);
    throw error;
  } finally {
    connection.release();
  }
};