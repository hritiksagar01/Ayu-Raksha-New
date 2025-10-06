// src/components/common/Footer.tsx
'use client';

import type { Translations } from '@/types';

interface FooterProps {
  translations: Translations;
  selectedLanguage: string;
}

export default function Footer({ translations, selectedLanguage }: FooterProps) {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm">
          {translations.copyright[selectedLanguage]}
        </p>
        <p className="text-xs text-gray-400 mt-2">
          Healthcare Management System
        </p>
      </div>
    </footer>
  );
}