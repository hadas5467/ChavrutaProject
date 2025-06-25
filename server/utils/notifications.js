// utils/notifications.js
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,      // המייל שלך
    pass: process.env.EMAIL_PASSWORD,  // סיסמת אפליקציה – לא הסיסמה הרגילה
  },
});

export const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };

  await transporter.sendMail(mailOptions);
};
