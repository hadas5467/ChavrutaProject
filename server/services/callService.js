

import { findByFilter } from '../dataServices/userServices.js';
import { sendEmail } from '../utils/notifications.js';
import { create as createCall,createCallRecipients,getIsCallRecipients } from '../dataServices/callServices.js';

export const handleCallCreation = async (callData, senderUser) => {
  // הוספת מזהה המשתמש ומינו לנתוני הקריאה
  callData.userId = senderUser.id;
  
  // 1. יצירת הקריאה הראשית במסד הנתונים
  const createdCall = await createCall(callData);

  // 2. הכנת פילטר למציאת משתמשים מתאימים
  const filter = {
    ...callData,
    sex: senderUser.sex
  };
  delete filter.userId; // הסרת המזהה של היוצר מהפילטר

  const users = await findByFilter(filter);
  console.log("🧪 פילטר שנשלח ל־findByFilter:", filter);
  console.log("🔍 מספר המשתמשים שנמצאו:", users.length);

  // 3. עבור כל משתמש מתאים, הוסף אותו לרשימת הנמענים
  for (const user of users) {
    if (user.userId === senderUser.id) continue;

    // בדיקה אם כבר קיים
    const [existing] = await getIsCallRecipients(createdCall.id, user.userId);
    if (existing.length === 0) {
     createCallRecipients(createdCall.id, senderUser.id, user.userId);
    } else {
      console.log(`🔁 כבר קיים recipient עבור userId=${user.userId} ו־callId=${createdCall.id}`);
    }

    // שליחת מייל אם צריך
    if (user.contactMethod === 'email') {
      const subject = '📩 קריאה חדשה להצטרפות לחברותא';
      const message = `שלום ${user.name},\n\nנוצרה עבורך קריאה חדשה להצטרפות לחברותא.\n\nהיכנס למערכת לפרטים נוספים.`;
      await sendEmail(user.gmail, subject, message);
    }
  }

  return createdCall;
};