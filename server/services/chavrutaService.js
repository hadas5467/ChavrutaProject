import { getById } from '../dataServices/userServices.js';
import { sendEmail } from '../utils/notifications.js';
import { create as createChavruta } from '../dataServices/chavrutaServices.js';
import { update as updateCall } from '../dataServices/callServices.js';
import { updateByCallAndUser as updateJoinRequest } from '../dataServices/joinRequestSevices.js';

export const handleChavrutaCreation = async (chavrutaData) => {
  const { user1, user2, callId, notesUser1 = '', notesUser2 = '' } = chavrutaData;

  // שליפת הקריאה
  const call = await getById(callId); // אם יש לך getById ב-callServices
  if (!call) throw new Error('Call not found');

  // שליפת המשתמשים
  const userObj1 = await getById(user1);
  const userObj2 = await getById(user2);
  if (!userObj1 || !userObj2) throw new Error('User not found');

  // יצירת קישור Jitsi אם צריך
  let meetingLink = call.place;
  if (call.learningFormat === 'zoom') {
    meetingLink = `https://meet.jit.si/chavruta_${call.callId}_${user1}_${user2}`;
    await updateCall(callId, { place: meetingLink });
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
  if (userObj2.contactMethod === 'email') {
    const subject = 'הוזמנת לחברותא!';
    const message = `
      שלום ${userObj2.name},
      בקשתך להצטרף לחברותא אושרה!
      ${call.learningFormat === 'zoom' ? `קישור לשיחה: ${meetingLink}` : `כתובת: ${call.place}`}
    `;
    try {
      await sendEmail(userObj2.gmail, subject, message);
    } catch (error) {
      console.error('שגיאה בשליחת מייל:', error.message, error);
    }
  }

  const result = {
    success: true,
    meetingLink: call.learningFormat === 'zoom' ? meetingLink : null,
    address: call.learningFormat !== 'zoom' ? call.place : null
  };

  return result;
};