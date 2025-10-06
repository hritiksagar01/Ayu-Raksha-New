// src/components/features/PortalCard.tsx
'use client';

import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  buildCardClasses, 
  buildIconContainerClasses, 
  buildIconClasses, 
  buildButtonClasses 
} from '@/lib/className';
import type { PortalConfig, PortalVariant } from '@/constants/portals';
import type { Translations } from '@/types';

interface PortalCardProps {
  portal: PortalConfig;
  translations: Translations;
  selectedLanguage: string;
  onLoginClick: () => void;
  onSignupClick: () => void;
}

export default function PortalCard({
  portal,
  translations,
  selectedLanguage,
  onLoginClick,
  onSignupClick,
}: PortalCardProps) {
  const Icon = portal.icon;
  const variant: PortalVariant = portal.id;

  return (
    <Card className={buildCardClasses(variant)}>
      <CardHeader className="text-center pb-4">
        <div className={buildIconContainerClasses(variant)}>
          <Icon className={buildIconClasses(variant)} />
        </div>
        
        <CardTitle className="text-2xl">
          {translations[portal.titleKey]?.[selectedLanguage]}
        </CardTitle>
        
        <CardDescription>
          {translations[portal.descriptionKey]?.[selectedLanguage]}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="text-center space-y-2">
        <Button 
          onClick={onLoginClick}
          className={buildButtonClasses(variant)}
          size="lg"
        >
          {translations.login?.[selectedLanguage]}
        </Button>
        
        <Button 
          onClick={onSignupClick}
          variant="outline"
          className="w-full"
          size="lg"
        >
          {translations.signup?.[selectedLanguage]}
        </Button>
      </CardContent>
    </Card>
  );
}