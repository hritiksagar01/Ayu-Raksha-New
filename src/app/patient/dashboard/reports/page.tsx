// src/app/patient/dashboard/reports/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { FileText, Activity, Stethoscope, FlaskConical } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';
import { translations } from '@/constants/translations';
import { getTranslation } from '@/lib/translations';
import { mockRecords } from '@/lib/mockData';
import { format } from 'date-fns';

export default function PatientReportsPage() {
  const router = useRouter();
  const { selectedLanguage } = useStore();

  const t = (key: string, fallback?: string) =>
    getTranslation(translations, key, selectedLanguage, fallback);

  const getRecordIcon = (type: string) => {
    switch (type) {
      case 'Prescription':
        return { icon: FileText, color: 'text-blue-600', bg: 'bg-blue-500' };
      case 'Blood Report':
        return { icon: FlaskConical, color: 'text-red-600', bg: 'bg-red-500' };
      case 'Scan':
        return { icon: Activity, color: 'text-purple-600', bg: 'bg-purple-500' };
      case 'Consultation':
        return { icon: Stethoscope, color: 'text-green-600', bg: 'bg-green-500' };
      default:
        return { icon: FileText, color: 'text-gray-600', bg: 'bg-gray-500' };
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {t('myReports', 'My Reports')}
        </h1>
        <p className="text-gray-600 mt-1">
          {t('reportsDescription', 'View and manage your medical reports')}
        </p>
      </div>

      <div className="grid gap-4">
        {mockRecords.map((record) => {
          const iconConfig = getRecordIcon(record.type);
          const Icon = iconConfig.icon;

          return (
            <Card
              key={record.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => router.push(`/patient/dashboard/reports/${record.id}`)}
            >
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className={`flex-shrink-0 w-14 h-14 rounded-full ${iconConfig.bg} flex items-center justify-center`}>
                    <Icon className="h-7 w-7 text-white" />
                  </div>

                  <div className="flex-grow">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-lg text-gray-800">
                        {record.type}
                      </h3>
                      <Badge variant={record.status === 'Normal' ? 'default' : 'secondary'}>
                        {record.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      {format(new Date(record.date), 'MMMM d, yyyy')}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {t('doctor', 'Doctor')}: {record.doctor} • {record.clinic}
                    </p>
                  </div>

                  <Button variant="outline">
                    {t('viewDetails', 'View Details')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {mockRecords.length === 0 && (
        <Card>
          <CardContent className="py-10 text-center">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">{t('noReports', 'No reports available')}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}