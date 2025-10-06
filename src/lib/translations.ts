// src/lib/translations.ts
import type { Translations, LanguageKey } from '@/types';

export function getTranslation(
  translations: Translations,
  key: string,
  language: string,
  fallback?: string
): string {
  const translationObj = translations[key];
  
  if (!translationObj) {
    console.warn(`Translation key "${key}" not found`);
    return fallback || key;
  }

  const value = translationObj[language as LanguageKey] || translationObj['English'];
  
  return value || fallback || key;
}