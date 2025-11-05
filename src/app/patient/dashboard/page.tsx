// src/app/patient/dashboard/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Activity, 
  AlertTriangle, 
  MessageSquare, 
  TrendingUp, 
  Calendar,
  FileText,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/lib/store';
import { translations } from '@/constants/translations';
import { getTranslation } from '@/lib/translations';
import { uploadApi, patientApi, authApi } from '@/lib/api';
import { mockAlerts, mockRecords } from '@/lib/mockData';
import { getPatientDisplayId } from '@/lib/utils';

export default function PatientDashboardPage() {
  const router = useRouter();
  const { selectedLanguage, user, setUser } = useStore();
  const [reportsCount, setReportsCount] = useState<number>(0);
  const [alertsCount, setAlertsCount] = useState<number>(0);
  const [appointmentsCount, setAppointmentsCount] = useState<number>(0);
  const [latestRecordTitle, setLatestRecordTitle] = useState<string>(
    'Blood Test Results Available'
  );
  const [latestRecordSummary, setLatestRecordSummary] = useState<string>(
    getTranslation(translations, 'latestUpdateContent', selectedLanguage, 'Your recent blood test results are available. All parameters are within normal range.')
  );
  const [displayName, setDisplayName] = useState<string>(user?.name || 'Patient');
  const [displayPatientId, setDisplayPatientId] = useState<string>(
    user?.patientCode ? user.patientCode.padStart(12, '0').slice(-12) : getPatientDisplayId(user?.id)
  );

  const t = (key: string, fallback?: string) =>
    getTranslation(translations, key, selectedLanguage, fallback);

  // Keep display values in sync when user changes
  useEffect(() => {
    if (user) {
      setDisplayName(user.name || 'Patient');
      if (user.patientCode) {
        setDisplayPatientId(user.patientCode.padStart(12, '0').slice(-12));
      } else {
        setDisplayPatientId(getPatientDisplayId(user.id));
      }
    }
  }, [user]);

  // Fetch dynamic counts where possible
  useEffect(() => {
    // Prefer backend aggregation endpoint if patientCode exists
    async function fetchDashboard() {
      try {
        if (!user?.patientCode) return;
        const res = await patientApi.getDashboard(user.patientCode);
        if (res.success && res.data?.counts) {
          setAppointmentsCount(res.data.counts.appointmentsUpcoming ?? 0);
          setAlertsCount(res.data.counts.alertsActive ?? 0);
          setReportsCount(res.data.counts.reportsRecent ?? 0);
          if (res.data.latestRecord) {
            setLatestRecordTitle(`${res.data.latestRecord.type} ${t('resultsAvailable', 'Update')}`);
            if (res.data.latestRecord.findings && res.data.latestRecord.findings.length > 0) {
              setLatestRecordSummary(res.data.latestRecord.findings.substring(0, 160) + '...');
            }
          }
        }
      } catch (e) {
        // fall back handled below
      }
    }
    fetchDashboard();
    // If user not in store, try to fetch from backend using JWT
    async function ensureUser() {
      try {
        if (!user) {
          const me = await authApi.me();
          if (me.success && me.data?.user) {
            setUser(me.data.user);
            setDisplayName(me.data.user.name || 'Patient');
            const code = (me.data.user as any).patientCode as string | undefined;
            if (code) {
              setDisplayPatientId(code.padStart(12, '0').slice(-12));
            } else {
              setDisplayPatientId(getPatientDisplayId(me.data.user.id));
            }
          }
        }
      } catch {
        // ignore
      }
    }
    ensureUser();

    // Alerts from mock (replace with API when available)
    setAlertsCount(mockAlerts.length);

    // Latest record from mock
    if (mockRecords.length > 0) {
      const latest = mockRecords[0];
      setLatestRecordTitle(`${latest.type} Results Available`);
      setLatestRecordSummary(latest.findings.substring(0, 160) + '...');
    }

    // Reports from upload API if backend available; fallback to mock
    async function fetchReports() {
      try {
        const targetPatientCode = user?.patientCode;
        if (targetPatientCode) {
          const res = await uploadApi.listFiles(targetPatientCode);
          if (res.success && Array.isArray(res.data)) {
            setReportsCount(res.data.length);
          } else {
            setReportsCount(mockRecords.length);
          }
        } else if (user?.id) {
          // Backend expects patientCode; if absent, fall back to mock until available
          setReportsCount(mockRecords.length);
        } else {
          setReportsCount(mockRecords.length);
        }
      } catch {
        setReportsCount(mockRecords.length);
      }
    }

    // Appointments - no API yet; default 0 (or from timeline in future)
    setAppointmentsCount(0);
    fetchReports();
    // Also try to verify patient and pick backend-provided name/id if present
    async function fetchProfile() {
      try {
        if (!user) return;
        const code = user.patientCode;
        if (!code) return; // backend profile lookup requires patientCode
        console.log('🔎 Fetching patient profile for patientCode', code);
        const res = await patientApi.verifyPatient(code);
        console.log('📥 Patient profile response', res);
        if (res.success && res.data) {
          const backendName = (res.data as any).name as string | undefined;
          const backendPatientCode = (res.data as any).patientCode as string | undefined;
          if (backendName) setDisplayName(backendName);
          if (backendPatientCode && backendPatientCode.length >= 6) {
            setDisplayPatientId(backendPatientCode.padStart(12, '0').slice(-12));
          }
        }
      } catch {
        // silently ignore, fallback already set
      }
    }
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.patientCode]);

  const stats = [
    {
      title: t('upcomingAppointments', 'Upcoming Appointments'),
      value: String(appointmentsCount),
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      link: '/patient/dashboard/timeline',
    },
    {
      title: t('activeAlerts', 'Active Alerts'),
      value: String(alertsCount),
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      link: '/patient/dashboard/alerts',
    },
    {
      title: t('recentReports', 'Recent Reports'),
      value: String(reportsCount),
      icon: FileText,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      link: '/patient/dashboard/reports',
    },
  ];

  const quickActions = [
    {
      title: t('viewReports', 'View All Reports'),
      description: t('viewReportsDesc', 'Access your medical records'),
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      link: '/patient/dashboard/reports',
    },
    {
      title: t('healthTimeline', 'Health Timeline'),
      description: t('healthTimelineDesc', 'Track your health history'),
      icon: Activity,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      link: '/patient/dashboard/timeline',
    },
    {
      title: t('findDoctors', 'Find Doctors'),
      description: t('findDoctorsDesc', 'Search for healthcare providers'),
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      link: '/patient/dashboard/doctors',
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-100">
        <h1 className="text-3xl font-bold text-gray-900">
          {t('welcomeBack', 'Welcome back')}, {displayName}! 👋
        </h1>
        <p className="text-gray-600 mt-2">
          {t('dashboardSubtitle', 'Here\'s your health overview for today')}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Last login: {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
        <p className="text-sm text-gray-700 mt-1">
          Patient ID: <span className="font-mono font-semibold">{displayPatientId}</span>
        </p>
      </div>

      {/* Stats Grid - Now Clickable */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card 
              key={index}
              className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
              onClick={() => router.push(stat.link)}
            >
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold mt-2">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-gray-500">
                  <span>View details</span>
                  <ArrowRight className="ml-1 h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Latest Update */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="mr-2 h-5 w-5 text-blue-600" />
              {t('latestUpdate', 'Latest Update')}
            </CardTitle>
            <CardDescription>
              {t('latestUpdateDescription', 'Your most recent health activity')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-5 rounded-lg mb-4 border border-green-100">
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <FileText className="h-5 w-5 text-green-600" />
                  </div>
                </div>
                <div className="flex-grow">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {latestRecordTitle}
                  </h3>
                  <p className="text-gray-700 text-sm">
                    {latestRecordSummary}
                  </p>
                  <Badge className="mt-2 bg-green-500">Normal Range</Badge>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => router.push('/patient/dashboard/reports/rec-1')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <FileText className="mr-2 h-4 w-4" />
                {t('viewDetails', 'View Report')}
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push('/patient/dashboard/reports')}
              >
                {t('allReports', 'All Reports')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Alerts */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-red-600" />
              {t('alerts', 'Alerts')}
            </CardTitle>
            <CardDescription>
              <Badge variant="destructive" className="mt-1">
                2 {t('new', 'New')}
              </Badge>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 mb-4">
              <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-md">
                <div className="flex items-start">
                  <AlertTriangle className="h-4 w-4 text-red-600 mr-2 mt-0.5" />
                  <p className="text-red-800 text-sm">
                    {t('highBPAlert', 'High blood pressure detected in recent reading')}
                  </p>
                </div>
              </div>
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 rounded-md">
                <div className="flex items-start">
                  <AlertTriangle className="h-4 w-4 text-yellow-600 mr-2 mt-0.5" />
                  <p className="text-yellow-800 text-sm">
                    Medication reminder: Take prescribed medicine
                  </p>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => router.push('/patient/dashboard/alerts')}
              className="w-full hover:bg-red-50 hover:text-red-700 hover:border-red-300"
            >
              {t('viewAllAlerts', 'View All Alerts')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {t('quickActions', 'Quick Actions')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Card 
                key={index}
                className="cursor-pointer hover:shadow-md transition-all duration-200 hover:border-gray-400"
                onClick={() => router.push(action.link)}
              >
                <CardContent className="pt-6">
                  <div className={`p-3 rounded-full ${action.bgColor} w-fit mb-3`}>
                    <Icon className={`h-6 w-6 ${action.color}`} />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{action.description}</p>
                  <div className="flex items-center text-sm font-medium text-blue-600">
                    <span>Access now</span>
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* AI Assistant */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageSquare className="mr-2 h-6 w-6 text-indigo-600" />
            {t('aiAssistant', 'AI Health Assistant')}
          </CardTitle>
          <CardDescription>
            {t('aiAssistantDescription', 'Get instant answers to your health questions 24/7')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => router.push('/patient/dashboard/chatbot')}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              {t('startChat', 'Start Chat Now')}
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/patient/dashboard/chatbot')}
              className="border-indigo-300 text-indigo-700 hover:bg-indigo-50"
            >
              {t('viewHistory', 'View Chat History')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}