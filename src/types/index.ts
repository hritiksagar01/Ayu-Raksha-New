// src/types/index.ts

export type UserType = 'patient' | 'doctor' | 'uploader';

export type LanguageKey = 'English' | 'Hindi';

export interface User {
  id: string;
  name: string;
  email: string;
  type: UserType;
  phone?: string;
  avatar?: string;
  createdAt?: string;
}

export interface Patient extends User {
  type: 'patient';
  dateOfBirth?: string;
  bloodType?: string;
  allergies?: string[];
  gender?: 'male' | 'female' | 'other';
  address?: string;
}

export interface Doctor extends User {
  type: 'doctor';
  specialization?: string;
  licenseNumber?: string;
}

export interface Uploader extends User {
  type: 'uploader';
  facility?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  acceptTerms?: boolean;
}

export interface GoogleSignupData {
  name: string;
  email: string;
  avatar?: string;
  googleId: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  date: string;
  diagnosis: string;
  prescription?: string;
  doctorId: string;
  doctorName: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  reason: string;
}

// ✅ FIX: Add index signature with proper typing
export interface TranslationValue {
  English: string;
  Hindi: string;
  [key: string]: string; // Allow any string key
}

export interface Translations {
  [key: string]: TranslationValue;
}
export interface Alert {
  id: string;
  type: 'High Risk' | 'Guidance' | 'Advisory';
  title: {
    English: string;
    Hindi: string;
  };
  summary: {
    English: string;
    Hindi: string;
  };
  details: {
    English: string;
    Hindi: string;
  };
  date: string;
}

export interface MedicalRecord {
  id: string;
  type: 'Prescription' | 'Blood Report' | 'Scan' | 'Consultation';
  date: string;
  doctor: string;
  clinic: string;
  findings: string;
  status: 'Normal' | 'Reviewed';
}export interface ChatMessage {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp?: Date;
}

export interface Doctor {
  id: string;
  name: string;
  type: 'doctor';
  specialty: string;
  rating: number;
  distance: string;
  location: string;
  phone: string;
  email: string;
  address: string;
  about: string;
  services: string[];
}