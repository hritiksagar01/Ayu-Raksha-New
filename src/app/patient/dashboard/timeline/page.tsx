// src/app/patient/dashboard/timeline/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Activity, Stethoscope, FlaskConical } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useStore } from '@/lib/store';
import { translations } from '@/constants/translations';
import { getTranslation } from '@/lib/translations';
import { mockRecords } from '@/lib/mockData';
import { format } from 'date-fns';
import type { MedicalRecord } from '@/types';
import { patientApi } from '@/lib/api';

export default function PatientTimelinePage() {
  const router = useRouter();
  const { selectedLanguage, user } = useStore();
  const [filteredRecords, setFilteredRecords] = useState<MedicalRecord[]>(mockRecords);
  const [filterType, setFilterType] = useState('All');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [loading, setLoading] = useState(false);

  const t = (key: string, fallback?: string) =>
    getTranslation(translations, key, selectedLanguage, fallback);

  useEffect(() => {
    async function fetchRecords() {
      try {
        setLoading(true);
        if (!user?.patientCode) {
          // Until patientCode is present, show mock
          let records = [...mockRecords];
          setFilteredRecords(applyLocalFilters(records));
          return;
        }
        const params: any = { limit: 50 };
        if (filterType !== 'All') params.type = filterType;
        if (fromDate) params.from = fromDate;
        if (toDate) params.to = toDate;
        const res = await patientApi.listRecords(user.patientCode, params);
        if (res.success && Array.isArray(res.data)) {
          // Map backend records into MedicalRecord shape if needed
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
          setFilteredRecords(mapped);
        } else {
          setFilteredRecords(applyLocalFilters([...mockRecords]));
        }
      } catch {
        setFilteredRecords(applyLocalFilters([...mockRecords]));
      } finally {
        setLoading(false);
      }
    }
    fetchRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterType, fromDate, toDate, user?.patientCode]);

  function applyLocalFilters(records: MedicalRecord[]) {
    let list = [...records];
    if (filterType !== 'All') list = list.filter(r => r.type === filterType);
    if (fromDate) list = list.filter(r => new Date(r.date) >= new Date(fromDate));
    if (toDate) list = list.filter(r => new Date(r.date) <= new Date(toDate));
    return list;
  }

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

  // Type inference fallback no longer required since backend now maps S3 files into records

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {t('healthTimeline', 'Health Timeline')}
        </h1>
        <p className="text-gray-600 mt-1">
          {t('timelineDescription', 'Your complete medical history in one place')}
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="filter-type">{t('recordType', 'Record Type')}</Label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger id="filter-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">{t('all', 'All')}</SelectItem>
                  <SelectItem value="Prescription">{t('prescription', 'Prescription')}</SelectItem>
                  <SelectItem value="Blood Report">{t('bloodReport', 'Blood Report')}</SelectItem>
                  <SelectItem value="Scan">{t('scan', 'Scan')}</SelectItem>
                  <SelectItem value="Consultation">{t('consultation', 'Consultation')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="from-date">{t('fromDate', 'From Date')}</Label>
              <Input
                id="from-date"
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="to-date">{t('toDate', 'To Date')}</Label>
              <Input
                id="to-date"
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <div className="space-y-4">
        {loading ? (
          <Card><CardContent className="py-10 text-center"><p className="text-gray-500">{t('loading', 'Loading...')}</p></CardContent></Card>
        ) : filteredRecords.length > 0 ? (
          filteredRecords.map((record) => {
            const iconConfig = getRecordIcon(record.type);
            const Icon = iconConfig.icon;

            return (
              <Card
                key={record.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => router.push(`/patient/dashboard/reports/${record.id}`)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-full ${iconConfig.bg} flex items-center justify-center`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>

                    <div className="flex-grow">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-gray-800">
                          {record.type} - {format(new Date(record.date), 'MMM d, yyyy')}
                        </p>
                        <Badge variant={record.status === 'Normal' ? 'default' : 'secondary'}>
                          {record.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {t('doctor', 'Doctor')}: {record.doctor}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card>
            <CardContent className="py-10 text-center">
              <p className="text-gray-500">{t('noRecordsFound', 'No records found')}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}