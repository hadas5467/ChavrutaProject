import { findByFilter } from '../dataServices/userServices.js';
import { sendEmail } from '../utils/notifications.js';
import { create as createCall } from '../dataServices/callServices.js';
import pool from '../dataServices/DB.js';

export const handleCallCreation = async (callData, senderUser) => {
  // שליפת משתמשים מתאימים לפי פילטרים (כולל sex)
  const filter = {
    ...callData,
    sex: senderUser.sex
  };
  const users = await findByFilter(filter);

  // צור קריאה אחת בלבד (של השולח)
  const call = {
    ...callData,
    userId: senderUser.userId
  };
  const createdCall = await createCall(call);

  // עבור כל משתמש מתאים (למעט השולח) - הוסף לרשימת נמענים ושלח מייל אם צריך
  for (const user of users) {
    if (user.userId === senderUser.userId) continue;

    // הוספה לטבלת CallRecipients
    await pool.query(
      'INSERT INTO CallRecipients (callId, userId, targetUserId) VALUES (?, ?, ?)',
      [createdCall.id, senderUser.userId, user.userId]
    );

    // שליחת מייל אם צריך
    if (user.contactMethod === 'email') {
      const subject = '📩 קריאה חדשה להצטרפות לחברותא';
      const message = `שלום ${user.name},\n\nנוצרה עבורך קריאה חדשה להצטרפות לחברותא.\n\nהיכנס למערכת לפרטים נוספים.`;
      await sendEmail(user.gmail, subject, message);
    }
  }

  return createdCall;
};