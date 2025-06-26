import * as z from 'zod';

export const signUpSchema = z.object({
  name: z.string().min(2, 'השם חייב לכלול לפחות 2 תווים'),
  gmail: z.string().email('כתובת מייל לא תקינה'),
  sex: z.enum(['male', 'female'], { required_error: 'יש לבחור מין' }),
  password: z.string().min(6, 'סיסמה חייבת לפחות 6 תווים'),
});
