// src/components/features/FeatureCard.tsx
'use client';

import { cn } from '@/lib/className';
import type { FeatureConfig } from '@/constants/features';
import type { Translations } from '@/types';

interface FeatureCardProps {
  feature: FeatureConfig;
  translations: Translations;
  selectedLanguage: string;
}

export default function FeatureCard({ 
  feature, 
  translations, 
  selectedLanguage 
}: FeatureCardProps) {
  // Debug: Check if translations exist
  const title = translations[feature.titleKey]?.[selectedLanguage];
  const description = translations[feature.descriptionKey]?.[selectedLanguage];

  console.log('Feature Card Debug:', {
    titleKey: feature.titleKey,
    descriptionKey: feature.descriptionKey,
    title,
    description,
    selectedLanguage,
  });

  return (
    <div className="flex flex-col items-center">
      {/* Emoji */}
      <div className={cn('text-3xl font-bold mb-2', feature.color)}>
        {feature.emoji}
      </div>
      
      {/* Title */}
      <h3 className="font-semibold text-lg mb-2 text-gray-900">
        {title || 'Title Missing'}
      </h3>
      
      {/* Description */}
      <p className="text-gray-600 text-sm text-center">
        {description || 'Description Missing'}
      </p>
    </div>
  );
}