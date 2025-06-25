import { getUserById } from '../dataServices/userServices.js';
import { sendEmail } from '../utils/notifications.js';
import { create } from '..//dataServices/joinRequestSevices.js';

export const handleJoinRequest = async (joinData) => {
  const { callId, id, targetUserId, details } = joinData;
  const user = await getUserById(targetUserId);
  if (!user) throw new Error('Target user not found');

  const request = await create(joinData);

  if (user.contactMethod === 'email') {
    const subject = '📩 בקשת הצטרפות חדשה לחברותא';
    const message = `שלום ${user.name},\n\nיש בקשת הצטרפות חדשה לקריאה שלך (שיחה מספר ${callId}):\n"${details}"\n\nהיכנס למערכת כדי לאשר או לדחות.`;
    await sendEmail(user.gmail, subject, message);
  }

  return request;
};
