import { z } from 'zod';

export const callSchema = z.object({
  subject: z.string().min(2, 'נושא חייב להכיל לפחות 2 תווים'),
  material: z.string().optional(),
  learningFormat: z.string().min(1, 'פורמט לימוד נדרש'),
  preferredDuration: z.string().min(1, 'משך לימוד נדרש'),
  ageRange: z.string().min(1, 'טווח גילאים נדרש'),
  notes: z.string().optional(),
  time: z.string().min(1, 'יש לבחור זמן ומועד'),
});
