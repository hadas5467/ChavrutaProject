import * as z from 'zod';

export const UserProfileSchema = z.object({
  name: z.string().min(2, 'הכנס שם מלא'),
  gmail: z.string().email('הכנס כתובת מייל תקינה'),
  phone: z.string().min(7, 'מספר טלפון לא תקין'),
  age: z.string().nonempty('בחר גיל'),
  sector: z.string().nonempty('בחר מגזר'),
  contactMethod: z.string().nonempty('בחר אמצעי קשר'),
  city: z.string().min(2, 'הכנס עיר מגורים'),
  country: z.string().default('ישראל'),
  languages: z.union([
    z.array(z.string()).min(1, 'בחר לפחות שפה אחת'),
    z.string().transform(str => [str])  // תמיכה במקרה שבא מחרוזת אחת
  ]),
  bio: z.string().min(5, 'הכנס ביוגרפיה'),
  experienceLevel: z.string().optional(),
  availabilityStatus: z.string().optional(),
  tags: z.array(z.string()).optional()
});
