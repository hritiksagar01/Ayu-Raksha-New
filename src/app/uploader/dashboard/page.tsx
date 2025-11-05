// src/app/uploader/dashboard/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { Upload, History, FileText, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { useStore } from '@/lib/store';
import { translations } from '@/constants/translations';
import { getTranslation } from '@/lib/translations';

// Mock data for recent uploads
const mockRecentUploads = [
  { 
    id: 1, 
    patientId: '9876-5432-1098-7654', 
    patientName: 'Krishna Kumar',
    docType: 'Blood Report', 
    date: '2025-11-03', 
    status: 'Pending' 
  },
  { 
    id: 2, 
    patientId: '1122-3344-5566-7788', 
    patientName: 'Priya Sharma',
    docType: 'MRI Scan', 
    date: '2025-11-03', 
    status: 'Pending' 
  },
  { 
    id: 3, 
    patientId: '1234-5678-9012-3456', 
    patientName: 'Amit Singh',
    docType: 'Prescription', 
    date: '2025-11-02', 
    status: 'Authorized' 
  },
  { 
    id: 4, 
    patientId: '5555-6666-7777-8888', 
    patientName: 'Anjali Menon',
    docType: 'X-Ray Scan', 
    date: '2025-11-01', 
    status: 'Authorized' 
  },
];

export default function UploaderDashboardPage() {
  const router = useRouter();
  const { user, selectedLanguage } = useStore();

  const t = (key: string, fallback?: string) =>
    getTranslation(translations, key, selectedLanguage, fallback);

  const StatusBadge = ({ status }: { status: string }) => {
    const isPending = status === 'Pending';
    const text = isPending ? t('statusPending', 'Pending') : t('statusAuthorized', 'Authorized');
    
    if (isPending) {
      return (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          <Clock className="w-3 h-3 mr-1" />
          {text}
        </Badge>
      );
    }
    
    return (
      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
        <CheckCircle className="w-3 h-3 mr-1" />
        {text}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header translations={translations} />

      <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('uploaderWelcome', 'Welcome')}, {user?.name}!
          </h1>
          <p className="text-gray-600">
            {t('uploaderDashboardSubtitle', 'Manage and upload medical records efficiently')}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('totalUploads', 'Total Uploads')}
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">
                {t('allTimeUploads', 'All time uploads')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('pendingApprovals', 'Pending Approvals')}
              </CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                {t('awaitingAuthorization', 'Awaiting authorization')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('thisMonth', 'This Month')}
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">28</div>
              <p className="text-xs text-muted-foreground">
                {t('uploadedThisMonth', 'Uploaded this month')}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Upload className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <CardTitle>{t('uploadNewDocument', 'Upload New Document')}</CardTitle>
                  <CardDescription>
                    {t('uploadDocumentDesc', 'Upload medical records for patients')}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => router.push('/uploader/upload')} 
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                <Upload className="w-4 h-4 mr-2" />
                {t('startUpload', 'Start Upload')}
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <History className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle>{t('uploadHistory', 'Upload History')}</CardTitle>
                  <CardDescription>
                    {t('uploadHistoryDesc', 'View all uploaded records and their status')}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => router.push('/uploader/history')} 
                variant="outline"
                className="w-full"
              >
                <History className="w-4 h-4 mr-2" />
                {t('viewHistory', 'View History')}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Uploads Table */}
        <Card>
          <CardHeader>
            <CardTitle>{t('recentUploadsTitle', 'Recent Uploads')}</CardTitle>
            <CardDescription>
              {t('recentUploadsDesc', 'Your most recent document uploads')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('patientIdHeader', 'Patient ID')}</TableHead>
                    <TableHead>{t('patientNameHeader', 'Patient Name')}</TableHead>
                    <TableHead>{t('docTypeHeader', 'Document Type')}</TableHead>
                    <TableHead>{t('uploadDateHeader', 'Upload Date')}</TableHead>
                    <TableHead>{t('statusHeader', 'Status')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockRecentUploads.map((upload) => (
                    <TableRow key={upload.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{upload.patientId}</TableCell>
                      <TableCell>{upload.patientName}</TableCell>
                      <TableCell>{upload.docType}</TableCell>
                      <TableCell>{new Date(upload.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <StatusBadge status={upload.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="mt-4 text-center">
              <Button 
                variant="link" 
                onClick={() => router.push('/uploader/history')}
              >
                {t('viewAllUploads', 'View All Uploads')} →
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer translations={translations} selectedLanguage={selectedLanguage} />
    </div>
  );
}
