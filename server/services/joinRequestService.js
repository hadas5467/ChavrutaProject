import { getById } from '../dataServices/userServices.js';
import { sendEmail } from '../utils/notifications.js';
import { create } from '..//dataServices/joinRequestSevices.js';

export const handleJoinRequest = async (joinData) => {
  const { callId, id, targetUserId, details } = joinData;
  const user = await getById(targetUserId);
  if (!user) throw new Error('Target user not found');

  const request = await create(joinData);

  // if (user.contactMethod === 'email') {
  //   const subject = '📩 בקשת הצטרפות חדשה לחברותא';
  //   const message = `שלום ${user.name},\n\nיש בקשת הצטרפות חדשה לקריאה שלך (שיחה מספר ${callId}):\n"${details}"\n\nהיכנס למערכת כדי לאשר או לדחות.`;
  //   await sendEmail(user.gmail, subject, message);
  // }
if (user.contactMethod === 'email') {
    const subject = '📩 בקשת הצטרפות חדשה לחברותא';
    const message = `שלום ${user.name},\n\nיש בקשת הצטרפות חדשה לקריאה שלך (שיחה מספר ${callId}):\n"${details}"\n\nהיכנס למערכת כדי לאשר או לדחות.`;
    try {
      await sendEmail(user.gmail, subject, message);
    } catch (error) {
      console.error('שגיאה בשליחת מייל:', error.message, error);
      // אפשר גם להוסיף לוגיקה לדיווח או שמירה במסד נתונים אם תרצי
    }
  }
  return request;
};
