// src/constants/portals.ts
import { UserCircle, Stethoscope, Upload, type LucideIcon } from 'lucide-react';

export type PortalVariant = 'patient' | 'doctor' | 'uploader';

export interface PortalConfig {
  id: PortalVariant;
  icon: LucideIcon;
  titleKey: string;
  descriptionKey: string;
}

export const PORTALS: PortalConfig[] = [
  {
    id: 'patient',
    icon: UserCircle,
    titleKey: 'patientPortal',
    descriptionKey: 'patientDescription',
  },
  {
    id: 'doctor',
    icon: Stethoscope,
    titleKey: 'doctorPortal',
    descriptionKey: 'doctorDescription',
  },
  {
    id: 'uploader',
    icon: Upload,
    titleKey: 'uploaderPortal',
    descriptionKey: 'uploaderDescription',
  },
];