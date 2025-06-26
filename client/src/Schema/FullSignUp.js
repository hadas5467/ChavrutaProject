import * as z from 'zod';

export const fullSignUpSchema = z.object({
  name: z.string().min(2),
  gmail: z.string().email(),
  password: z.string().min(6),
  phone: z.string().min(7, 'מספר טלפון לא תקין'),
  age: z.string().nonempty('יש לבחור גיל'),
  sector: z.string().nonempty('יש לבחור מגזר'),
  contactMethod: z.string().nonempty('יש לבחור אמצעי קשר'),
  city: z.string().min(2),
  country: z.string().min(2),
  languages: z.array(z.string()).min(1, 'בחר לפחות שפה אחת'),
  bio: z.string().min(5),
  experienceLevel: z.string().nonempty('בחר רמת ניסיון'),
  availabilityStatus: z.string().nonempty('בחר סטטוס זמינות'),
  tags: z.array(z.string()).min(1, 'בחר לפחות תגית אחת'),
});
