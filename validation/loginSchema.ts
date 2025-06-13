import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().trim().email('Must be a valid email address'),
  password: z
    .string()
    .regex(/[^a-zA-Z0-9]/, 'Must include special characters')
    .regex(/\d/, 'Must include numbers')
    .regex(/[A-Z]/, 'Must include uppercase letters')
    .regex(/[a-z]/, 'Must include lowercase letters')
    .min(6, 'Must be at least 6 characters long'),
});
