// src/config/portals.config.ts
import { UserCircle, Stethoscope, Upload, type LucideIcon } from 'lucide-react';

export interface PortalConfig {
  id: 'patient' | 'doctor' | 'uploader';
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  name: string;
  titleKey: string;
  descriptionKey: string;
  dashboardRoute: string;
  loginRoute: string;
  signupRoute: string;
}

export const PORTAL_CONFIGS: Record<string, PortalConfig> = {
  patient: {
    id: 'patient',
    icon: UserCircle,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    name: 'Patient',
    titleKey: 'patientPortal',
    descriptionKey: 'patientDescription',
    dashboardRoute: '/patient/dashboard',
    loginRoute: '/patient/login',
    signupRoute: '/patient/signup',
  },
  doctor: {
    id: 'doctor',
    icon: Stethoscope,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    name: 'Doctor',
    titleKey: 'doctorPortal',
    descriptionKey: 'doctorDescription',
    dashboardRoute: '/doctor/dashboard',
    loginRoute: '/doctor/login',
    signupRoute: '/doctor/signup',
  },
  uploader: {
    id: 'uploader',
    icon: Upload,
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    name: 'Uploader',
    titleKey: 'uploaderPortal',
    descriptionKey: 'uploaderDescription',
    dashboardRoute: '/uploader/dashboard',
    loginRoute: '/uploader/login',
    signupRoute: '/uploader/signup',
  },
};