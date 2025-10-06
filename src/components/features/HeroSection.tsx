// src/components/features/HeroSection.tsx
'use client';

import type { Translations } from '@/types';

interface HeroSectionProps {
  translations: Translations;
  selectedLanguage: string;
}

export default function HeroSection({ translations, selectedLanguage }: HeroSectionProps) {
  return (
    <section className="text-center mb-12">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
        {translations.welcomeText?.[selectedLanguage]}
      </h1>
      
      <p className="text-xl text-gray-600">
        {translations.tagline?.[selectedLanguage]}
      </p>
    </section>
  );
}