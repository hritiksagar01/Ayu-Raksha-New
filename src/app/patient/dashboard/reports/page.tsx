// src/app/patient/dashboard/reports/page.tsx
'use client';

import React from 'react';
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
import { patientApi } from '@/lib/api';
import type { MedicalRecord } from '@/types';

export default function PatientReportsPage() {
  const router = useRouter();
  const { selectedLanguage, user } = useStore();
  const [records, setRecords] = React.useState<MedicalRecord[]>(mockRecords);
  const [loading, setLoading] = React.useState(false);
  const [syncing, setSyncing] = React.useState(false);

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

  React.useEffect(() => {
    async function fetchReports() {
      try {
        setLoading(true);
        if (!user?.patientCode) {
          setRecords(mockRecords);
          return;
        }
        const res = await patientApi.listRecords(user.patientCode, { limit: 50 });
        if (res.success && Array.isArray(res.data)) {
          const mapped: MedicalRecord[] = res.data.map((r: any) => ({
            id: String(r.id ?? r.key ?? Math.random()),
            type: r.type || 'Prescription',
            date: r.date || r.createdAt || new Date().toISOString(),
            doctor: r.doctor || r.doctorName || '—',
            clinic: r.clinic || r.facility || '',
            findings: r.findings || r.summary || '',
            status: r.status || 'Reviewed',
            fileUrl: r.fileUrl || r.url,
            filename: r.filename,
            size: r.size,
            fileKey: r.fileKey || r.key,
          }));
          setRecords(mapped);
        } else {
          setRecords(mockRecords);
        }
      } catch {
        setRecords(mockRecords);
      } finally {
        setLoading(false);
      }
    }
    fetchReports();
  }, [user?.patientCode]);

  async function handleSync() {
    if (!user?.patientCode) return;
    try {
      setSyncing(true);
      await patientApi.syncRecords(user.patientCode);
      // Refetch after sync
      const res = await patientApi.listRecords(user.patientCode, { limit: 50 });
      if (res.success && Array.isArray(res.data)) {
        const mapped: MedicalRecord[] = res.data.map((r: any) => ({
          id: String(r.id ?? r.key ?? Math.random()),
          type: r.type || 'Prescription',
          date: r.date || r.createdAt || new Date().toISOString(),
          doctor: r.doctor || r.doctorName || '—',
          clinic: r.clinic || r.facility || '',
          findings: r.findings || r.summary || '',
          status: r.status || 'Reviewed',
          fileUrl: r.fileUrl || r.url,
          filename: r.filename,
          size: r.size,
          fileKey: r.fileKey || r.key,
        }));
        setRecords(mapped);
      }
    } finally {
      setSyncing(false);
    }
  }

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

      <div className="flex items-center justify-between">
        <div />
        <Button variant="outline" disabled={!user?.patientCode || syncing} onClick={handleSync}>
          {syncing ? t('syncing', 'Syncing...') : t('syncRecords', 'Sync Records')}
        </Button>
      </div>

      <div className="grid gap-4">
        {loading ? (
          <Card><CardContent className="py-10 text-center"><p className="text-gray-500">{t('loading', 'Loading...')}</p></CardContent></Card>
        ) : records.map((record) => {
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

      {(!loading && records.length === 0) && (
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