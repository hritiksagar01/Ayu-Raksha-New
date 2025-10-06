// src/app/patient/dashboard/alerts/page.tsx
'use client';

import { useState } from 'react';
import { AlertTriangle, Info, Bell, ChevronDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';
import { translations } from '@/constants/translations';
import { getTranslation } from '@/lib/translations';
import { mockAlerts } from '@/lib/mockData';
import { format } from 'date-fns';

export default function PatientAlertsPage() {
  const { selectedLanguage } = useStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const t = (key: string, fallback?: string) =>
    getTranslation(translations, key, selectedLanguage, fallback);

  const getAlertStyles = (type: string) => {
    switch (type) {
      case 'High Risk':
        return {
          icon: AlertTriangle,
          bgColor: 'bg-red-50',
          borderColor: 'border-red-500',
          textColor: 'text-red-800',
          iconColor: 'text-red-600',
          badgeVariant: 'destructive' as const,
        };
      case 'Guidance':
        return {
          icon: Info,
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-500',
          textColor: 'text-yellow-800',
          iconColor: 'text-yellow-600',
          badgeVariant: 'default' as const,
        };
      case 'Advisory':
      default:
        return {
          icon: Bell,
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-500',
          textColor: 'text-blue-800',
          iconColor: 'text-blue-600',
          badgeVariant: 'secondary' as const,
        };
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {t('alerts', 'Alerts')}
        </h1>
        <p className="text-gray-600 mt-1">
          {t('alertsDescription', 'Important health notifications and reminders')}
        </p>
      </div>

      {mockAlerts.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">{t('noAlerts', 'No alerts available')}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {mockAlerts.map((alert) => {
            const styles = getAlertStyles(alert.type);
            const Icon = styles.icon;
            const isExpanded = expandedId === alert.id;
            const lang = selectedLanguage as 'English' | 'Hindi';

            return (
              <Card
                key={alert.id}
                className={`border-l-4 ${styles.borderColor} ${styles.bgColor} overflow-hidden`}
              >
                <CardContent className="p-0">
                  <Button
                    variant="ghost"
                    className="w-full p-4 hover:bg-transparent justify-start"
                    onClick={() => setExpandedId(isExpanded ? null : alert.id)}
                  >
                    <div className="flex items-start w-full">
                      <div className="flex-shrink-0 mr-4 mt-1">
                        <Icon className={`h-6 w-6 ${styles.iconColor}`} />
                      </div>
                      <div className="flex-grow text-left">
                        <div className="flex justify-between items-start">
                          <Badge variant={styles.badgeVariant} className="mb-2">
                            {alert.type}
                          </Badge>
                          <ChevronDown
                            className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${
                              isExpanded ? 'transform rotate-180' : ''
                            }`}
                          />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900 mt-1">
                          {alert.title[lang]}
                        </h2>
                        <p className="text-xs text-gray-500 mt-1">
                          {format(new Date(alert.date), 'MMMM d, yyyy')}
                        </p>
                        {!isExpanded && (
                          <p className="text-sm text-gray-700 mt-2">
                            {alert.summary[lang]}
                          </p>
                        )}
                      </div>
                    </div>
                  </Button>

                  {isExpanded && (
                    <div className="px-4 pb-4 ml-14 border-t border-gray-200 pt-3">
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {alert.details[lang]}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}