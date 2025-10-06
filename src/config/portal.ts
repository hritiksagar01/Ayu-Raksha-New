// src/config/portals.ts
import { UserCircle, Stethoscope, Upload } from 'lucide-react';

export const PORTAL_STYLES = {
  patient: {
    icon: UserCircle,
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-100',
    buttonColor: 'bg-blue-600 hover:bg-blue-700',
  },
  doctor: {
    icon: Stethoscope,
    iconColor: 'text-green-600',
    iconBg: 'bg-green-100',
    buttonColor: 'bg-green-600 hover:bg-green-700',
  },
  uploader: {
    icon: Upload,
    iconColor: 'text-purple-600',
    iconBg: 'bg-purple-100',
    buttonColor: 'bg-purple-600 hover:bg-purple-700',
  },
} as const;