// src/lib/validations/auth.ts
import * as z from 'zod';  // ✅ ADD THIS LINE AT THE TOP

const baseSignupSchema = {
  name: z.string().min(3, 'Name must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  phone: z.string().optional(),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions',
  }),
};

// Patient-specific fields
const patientFields = {
  dateOfBirth: z.string().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
};

// Doctor-specific fields
const doctorFields = {
  phone: z.string().min(10, 'Phone number is required for doctors'),
  licenseNumber: z.string().min(5, 'Valid medical license number is required'),
  specialization: z.string().min(2, 'Specialization is required'),
  experienceYears: z.string().optional(),
  qualification: z.string().optional(),
};

// Uploader-specific fields
const uploaderFields = {
  phone: z.string().min(10, 'Phone number is required'),
  facilityName: z.string().min(3, 'Facility name is required'),
  facilityType: z.string().optional(),
  facilityAddress: z.string().optional(),
};

export const patientSignupSchema = z.object({
  ...baseSignupSchema,
  ...patientFields,
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const doctorSignupSchema = z.object({
  ...baseSignupSchema,
  ...doctorFields,
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const uploaderSignupSchema = z.object({
  ...baseSignupSchema,
  ...uploaderFields,
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export type PatientSignupFormData = z.infer<typeof patientSignupSchema>;
export type DoctorSignupFormData = z.infer<typeof doctorSignupSchema>;
export type UploaderSignupFormData = z.infer<typeof uploaderSignupSchema>;