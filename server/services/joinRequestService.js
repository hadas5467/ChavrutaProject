import { getById } from '../dataServices/userServices.js';
import { sendEmail } from '../utils/notifications.js';
import { create,getCallCreatorByJoinRequestId } from '..//dataServices/joinRequestSevices.js';

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

export const handleJoinRequestDelete = async (id) => {
  
  const user = await getCallCreatorByJoinRequestId(id);
  if (!user) {
    console.error('User not found for join request ID:', id);
    throw new Error('Target user not found');
  }


if (user.contactMethod === 'email') {
    const subject = '❗ עדכון על בקשת החברותא שלך';
const message = `שלום ${user.name},

לצערנו, בקשתך להצטרף לשיחה (קריאה מספר ${callId}) לא אושרה.

📋 פרטי הקריאה:
"${details}"

תוכל לבדוק קריאות נוספות המתאימות לך במערכת, או ליצור קריאה חדשה משלך.

בהצלחה רבה בדרך ללימוד משמעותי,
צוות חברותא.
`;
    try {
      await sendEmail(user.gmail, subject, message);
    } catch (error) {
      console.error('שגיאה בשליחת מייל:', error.message, error);
      // אפשר גם להוסיף לוגיקה לדיווח או שמירה במסד נתונים אם תרצי
    }
  }
 
};
