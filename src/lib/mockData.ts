// src/lib/mockData.ts
import type { Alert, MedicalRecord, Doctor } from '@/types';

export const mockAlerts: Alert[] = [
  {
    id: '1',
    type: 'High Risk',
    title: {
      English: 'High Blood Pressure Detected',
      Hindi: 'उच्च रक्तचाप का पता चला',
    },
    summary: {
      English: 'Your recent blood pressure reading shows elevated levels.',
      Hindi: 'आपकी हाल की रक्तचाप रीडिंग उच्च स्तर दिखाती है।',
    },
    details: {
      English: 'Your blood pressure reading of 150/95 is higher than normal. Please consult your doctor immediately and avoid stress.',
      Hindi: '150/95 की आपकी रक्तचाप रीडिंग सामान्य से अधिक है। कृपया तुरंत अपने डॉक्टर से परामर्श लें और तनाव से बचें।',
    },
    date: '2025-01-04',
  },
  {
    id: '2',
    type: 'Guidance',
    title: {
      English: 'Medication Reminder',
      Hindi: 'दवा याद दिलाना',
    },
    summary: {
      English: 'Time to refill your prescription.',
      Hindi: 'अपने नुस्खे को फिर से भरने का समय।',
    },
    details: {
      English: 'Your blood pressure medication is running low. Please schedule a consultation to refill your prescription.',
      Hindi: 'आपकी रक्तचाप की दवा कम हो रही है। कृपया अपने नुस्खे को फिर से भरने के लिए परामर्श निर्धारित करें।',
    },
    date: '2025-01-03',
  },
  {
    id: '3',
    type: 'Advisory',
    title: {
      English: 'Annual Checkup Due',
      Hindi: 'वार्षिक जांच बाकी',
    },
    summary: {
      English: 'Schedule your annual health checkup.',
      Hindi: 'अपनी वार्षिक स्वास्थ्य जांच निर्धारित करें।',
    },
    details: {
      English: 'It\'s time for your annual health checkup. Regular checkups help in early detection of health issues.',
      Hindi: 'यह आपकी वार्षिक स्वास्थ्य जांच का समय है। नियमित जांच स्वास्थ्य समस्याओं का शीघ्र पता लगाने में मदद करती है।',
    },
    date: '2025-01-02',
  },
];

export const mockRecords: MedicalRecord[] = [
  {
    id: 'rec-1',
    type: 'Blood Report',
    date: '2025-01-04',
    doctor: 'Dr. Sharma',
    clinic: 'City Hospital',
    findings: 'All parameters within normal range. Hemoglobin: 14.2 g/dL, WBC: 7500/μL',
    status: 'Normal',
  },
  {
    id: 'rec-2',
    type: 'Prescription',
    date: '2025-01-03',
    doctor: 'Dr. Patel',
    clinic: 'Health Clinic',
    findings: 'Prescribed medication for hypertension: Amlodipine 5mg, once daily',
    status: 'Reviewed',
  },
  {
    id: 'rec-3',
    type: 'Consultation',
    date: '2025-01-01',
    doctor: 'Dr. Kumar',
    clinic: 'Wellness Center',
    findings: 'General checkup. Blood pressure slightly elevated. Advised lifestyle changes.',
    status: 'Reviewed',
  },
];

export const mockDoctors: Doctor[] = [
  {
    id: 'doc-1',
    name: 'Dr. Rajesh Sharma',
    type: 'doctor',
    specialty: 'Cardiologist',
    rating: 4.8,
    distance: '2.5 km',
    location: 'Mumbai',
    phone: '+91 98765 43210',
    email: 'dr.sharma@hospital.com',
    address: '123 Medical Street, Mumbai, Maharashtra 400001',
    about: 'Dr. Sharma is a renowned cardiologist with over 15 years of experience in treating heart conditions.',
    services: ['Heart Disease Treatment', 'ECG', 'Echocardiogram', 'Cardiac Consultation'],
  },
  {
    id: 'doc-2',
    name: 'Dr. Priya Patel',
    type: 'doctor',
    specialty: 'General Physician',
    rating: 4.5,
    distance: '1.2 km',
    location: 'Mumbai',
    phone: '+91 98765 43211',
    email: 'dr.patel@clinic.com',
    address: '456 Health Avenue, Mumbai, Maharashtra 400002',
    about: 'Dr. Patel specializes in general medicine and preventive healthcare.',
    services: ['General Consultation', 'Health Checkups', 'Vaccination', 'Chronic Disease Management'],
  },
  {
    id: 'doc-3',
    name: 'Apollo Hospital',
    type: 'hospital',
    specialty: 'Multi-Specialty Hospital',
    rating: 4.7,
    distance: '3.0 km',
    location: 'Mumbai',
    phone: '+91 22 1234 5678',
    email: 'contact@apollo.com',
    address: '789 Hospital Road, Mumbai, Maharashtra 400003',
    about: 'Apollo Hospital is a leading multi-specialty hospital providing comprehensive healthcare services.',
    services: ['24/7 Emergency', 'Surgery', 'Diagnostics', 'Intensive Care', 'Pharmacy'],
  },
];