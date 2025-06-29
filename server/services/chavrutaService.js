import { getById as getUserById } from '../dataServices/userServices.js';
import { getById as getCallById } from '../dataServices/callServices.js';
import { sendEmail } from '../utils/notifications.js';
import { create as createChavruta, getChavrutaById } from '../dataServices/chavrutaServices.js';
import { update as updateCall } from '../dataServices/callServices.js';
import { updateByCallAndUser as updateJoinRequest } from '../dataServices/joinRequestSevices.js';

export const handleChavrutaCreation = async (chavrutaData, connection = pool) => {
  const { user1, user2, callId, notesUser1 = '', notesUser2 = '' } = chavrutaData;

  // שליפת הקריאה
  const call = await getCallById(callId); // אם יש לך getById ב-callServices
  if (!call) throw new Error('Call not found');

  // שליפת המשתמשים
  const userObj1 = await getUserById(user1);
  const userObj2 = await getUserById(user2);
  if (!userObj1 || !userObj2) throw new Error('User not found');

  // יצירת קישור Jitsi אם צריך
  let meetingLink = call.place;
  if (call.learningFormat === 'zoom') {
    meetingLink = `https://meet.jit.si/chavruta_${call.callId}_${user1}_${user2}`;
    await updateCall(callId, { place: meetingLink, isActive: 0, targetUserId: user2 });
    
  }

  // עדכון סטטוס הבקשה ל-approved
  await updateJoinRequest({ callId, userId: user2 }, { status: "approved" });

  // יצירת חברותא חדשה
  await createChavruta({
    user1,
    user2,
    callId,
    notesUser1,
    notesUser2
  });

  // שליחת מייל אם צריך
const subject = 'הוזמנת לחברותא!';
const message = `
  שלום {name},
  בקשתך להצטרף לחברותא אושרה!
  ${call.learningFormat === 'zoom' ? `קישור לשיחה: ${meetingLink}` : `כתובת: ${call.place}`}
`;

const otherUser = (recipientId) =>
  recipientId === userObj1.userId ? userObj2 : userObj1;

const buildMailBody = (recipient, other, call, meetingLink) => `
שלום ${recipient.name},

בקשתך להצטרף לחברותא אושרה!

🧑‍🤝‍🧑 בן/בת הזוג שלך ללימוד: ${other.name}
${other.profile ? `📷 פרופיל: ${other.profile}` : ''}
${other.age ? `🎂 גיל: ${other.age}` : ''}
${other.gmail ? `✉️ מייל: ${other.gmail}` : ''}

📚 נושא: ${call.subject}
📖 חומר לימוד: ${call.material}
🕒 זמן: ${new Date(call.time).toLocaleString('he-IL')}
⏳ משך מועדף: ${call.preferredDuration}
👥 טווח גילאים: ${call.ageRange}
${call.notes ? `💬 הערות: ${call.notes}` : ''}

${call.learningFormat === 'zoom'
  ? `🔗 קישור לשיחה: ${meetingLink}`
  : `📍 כתובת: ${call.place || '---'}`}

בהצלחה ולימוד פורה!
צוות חברותא
`;

if (userObj1.contactMethod === 'email') {
  try {
    await sendEmail(
      userObj1.gmail,
      subject,
      buildMailBody(userObj1, userObj2, call, meetingLink)
    );
  } catch (error) {
    console.error('שגיאה בשליחת מייל-user1:', error.message, error);
  }
}
if (userObj2.contactMethod === 'email') {
  try {
    await sendEmail(
      userObj2.gmail,
      subject,
      buildMailBody(userObj2, userObj1, call, meetingLink)
    );
  } catch (error) {
    console.error('שגיאה בשליחת מייל ל-user2:', error.message, error);
  }
}

  const result = {
    success: true,
    meetingLink: call.learningFormat === 'zoom' ? meetingLink : null,
    address: call.learningFormat !== 'zoom' ? call.place : null
  };

  return result;
};