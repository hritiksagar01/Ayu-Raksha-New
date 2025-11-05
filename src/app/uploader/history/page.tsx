// src/app/uploader/history/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Eye, Download, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
import LoadingSpinner from '@/components/common/LoadingSpinner';

// Mock upload history data
const mockUploadHistory = [
  { 
    id: 1, 
    patientId: '9876543210987654', 
    patientName: 'Priya Sharma',
    documentType: 'Blood Report', 
    uploadDate: '2025-11-03', 
    fileName: 'blood_report_nov_2025.pdf',
    fileSize: 2.4,
    status: 'Completed',
    uploadedBy: 'Dr. Admin'
  },
  { 
    id: 2, 
    patientId: '1122334455667788', 
    patientName: 'Amit Singh',
    documentType: 'MRI Scan', 
    uploadDate: '2025-11-02', 
    fileName: 'mri_brain_scan.pdf',
    fileSize: 8.7,
    status: 'Completed',
    uploadedBy: 'Medical Staff'
  },
  { 
    id: 3, 
    patientId: '1234567890123456', 
    patientName: 'Krishna Kumar',
    documentType: 'X-Ray', 
    uploadDate: '2025-11-01', 
    fileName: 'chest_xray.jpg',
    fileSize: 1.9,
    status: 'Completed',
    uploadedBy: 'Dr. Admin'
  },
  { 
    id: 4, 
    patientId: '2233445566778899', 
    patientName: 'Anjali Menon',
    documentType: 'Prescription', 
    uploadDate: '2025-10-30', 
    fileName: 'prescription_oct_2025.pdf',
    fileSize: 0.5,
    status: 'Completed',
    uploadedBy: 'Medical Staff'
  },
  { 
    id: 5, 
    patientId: '9876543210987654', 
    patientName: 'Priya Sharma',
    documentType: 'CT Scan', 
    uploadDate: '2025-10-28', 
    fileName: 'ct_scan_abdomen.pdf',
    fileSize: 12.3,
    status: 'Completed',
    uploadedBy: 'Dr. Admin'
  },
];

export default function UploaderHistoryPage() {
  const router = useRouter();
  const { selectedLanguage } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState(mockUploadHistory);

  const t = (key: string, fallback?: string) =>
    getTranslation(translations, key, selectedLanguage, fallback);

  useEffect(() => {
    if (searchTerm) {
      const filtered = mockUploadHistory.filter(
        (item) =>
          item.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.patientId.includes(searchTerm) ||
          item.documentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.fileName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(mockUploadHistory);
    }
  }, [searchTerm]);

  const handleViewDocument = (id: number) => {
    // In a real app, this would open the document viewer
    console.log('View document:', id);
  };

  const handleDownloadDocument = (id: number, fileName: string) => {
    // In a real app, this would download the document
    console.log('Download document:', id, fileName);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header translations={translations} />

      <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('uploadHistory', 'Upload History')}
          </h1>
          <p className="text-gray-600">
            {t('viewAllUploadedDocuments', 'View all uploaded medical documents and their status')}
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>{t('documentHistory', 'Document History')}</CardTitle>
                <CardDescription>
                  {t('totalDocuments', 'Total')}: {filteredData.length} {t('documents', 'documents')}
                </CardDescription>
              </div>
              
              {/* Search */}
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder={t('searchByPatientOrDocument', 'Search by patient name, ID, or document...')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('uploadDate', 'Upload Date')}</TableHead>
                    <TableHead>{t('patientName', 'Patient Name')}</TableHead>
                    <TableHead>{t('patientId', 'Patient ID')}</TableHead>
                    <TableHead>{t('documentType', 'Document Type')}</TableHead>
                    <TableHead>{t('fileName', 'File Name')}</TableHead>
                    <TableHead>{t('fileSize', 'Size')}</TableHead>
                    <TableHead>{t('status', 'Status')}</TableHead>
                    <TableHead className="text-right">{t('actions', 'Actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.length > 0 ? (
                    filteredData.map((item) => (
                      <TableRow key={item.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">
                          {new Date(item.uploadDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{item.patientName}</TableCell>
                        <TableCell className="font-mono text-sm">
                          {item.patientId.slice(0, 4)}...{item.patientId.slice(-4)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {item.documentType}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-gray-400" />
                            {item.fileName}
                          </div>
                        </TableCell>
                        <TableCell>{item.fileSize.toFixed(1)} MB</TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            {item.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewDocument(item.id)}
                              title={t('viewDocument', 'View Document')}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDownloadDocument(item.id, item.fileName)}
                              title={t('downloadDocument', 'Download Document')}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-12 text-gray-500">
                        {t('noDocumentsFound', 'No documents found matching your search')}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="mt-6 flex justify-center">
              <Button
                variant="outline"
                onClick={() => router.push('/uploader/upload')}
              >
                {t('uploadNewDocument', 'Upload New Document')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer translations={translations} selectedLanguage={selectedLanguage} />
    </div>
  );
}
