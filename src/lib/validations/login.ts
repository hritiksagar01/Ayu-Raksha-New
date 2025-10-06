// src/lib/validations/login.ts
import * as z from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),  // ✅ Changed to email
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;