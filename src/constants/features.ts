// src/constants/features.ts

export interface FeatureConfig {
  emoji: string;
  color: string;
  titleKey: string;
  descriptionKey: string;
}

export const FEATURES: FeatureConfig[] = [
  {
    emoji: '🔒',
    color: 'text-blue-600',
    titleKey: 'secureFeatureTitle',           // Must match translations key
    descriptionKey: 'secureFeatureDescription', // Must match translations key
  },
  {
    emoji: '⚡',
    color: 'text-green-600',
    titleKey: 'fastFeatureTitle',             // Must match translations key
    descriptionKey: 'fastFeatureDescription',  // Must match translations key
  },
  {
    emoji: '🏥',
    color: 'text-purple-600',
    titleKey: 'comprehensiveFeatureTitle',           // Must match translations key
    descriptionKey: 'comprehensiveFeatureDescription', // Must match translations key
  },
];