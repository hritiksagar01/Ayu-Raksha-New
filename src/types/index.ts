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
  // Optional 12-digit identifier provided by backend for patients
  patientCode?: string;
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

// ✅ UNIFIED MedicalRecord interface
export interface MedicalRecord {
  id: string;
  type: 'Prescription' | 'Blood Report' | 'Scan' | 'Consultation';
  date: string;
  doctor: string;
  clinic: string;
  findings: string;
  status: 'Normal' | 'Reviewed' | 'Attention Required' | 'Critical';
  // Optional fields for backend compatibility
  patientId?: string;
  diagnosis?: string;
  prescription?: string;
  doctorId?: string;
  doctorName?: string;
  fileUrl?: string;
  filename?: string;
  size?: number;
  fileKey?: string;
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

export interface TranslationValue {
  English: string;
  Hindi: string;
  [key: string]: string;
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

export interface ChatMessage {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp?: Date;
}