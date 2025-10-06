// src/app/patient/dashboard/reports/[id]/page.tsx
'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Download, Sparkles, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { useStore } from '@/lib/store';
import { translations } from '@/constants/translations';
import { getTranslation } from '@/lib/translations';
import { mockRecords } from '@/lib/mockData';
import { format } from 'date-fns';

export default function ReportDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { selectedLanguage } = useStore();
  const [aiSummary, setAiSummary] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const report = mockRecords.find((r) => r.id === params.id);

  const t = (key: string, fallback?: string) =>
    getTranslation(translations, key, selectedLanguage, fallback);

  const handleGenerateSummary = async () => {
    setIsGenerating(true);
    setAiSummary('');

    // Mock AI summary generation
    setTimeout(() => {
      setAiSummary(
        'Based on your report findings, all parameters appear to be within normal ranges. Your hemoglobin levels are healthy, and white blood cell count is normal. Continue maintaining a balanced diet and regular exercise routine.'
      );
      setIsGenerating(false);
    }, 2000);
  };

  if (!report) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-red-600 font-semibold">
              {t('reportNotFound', 'Report not found')}
            </p>
            <Button onClick={() => router.back()} className="mt-4">
              {t('goBack', 'Go Back')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <Button variant="ghost" onClick={() => router.back()}>
        ← {t('back', 'Back')}
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">
              {t('reportDetails', 'Report Details')}
            </CardTitle>
            <Badge variant={report.status === 'Normal' ? 'default' : 'secondary'}>
              {report.status}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Report Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b">
            <div>
              <p className="text-sm text-gray-500">{t('reportType', 'Report Type')}</p>
              <p className="font-semibold text-gray-800">{report.type}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">{t('date', 'Date')}</p>
              <p className="font-semibold text-gray-800">
                {format(new Date(report.date), 'MMMM d, yyyy')}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">{t('doctor', 'Doctor')}</p>
              <p className="font-semibold text-gray-800">{report.doctor}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">{t('clinic', 'Clinic')}</p>
              <p className="font-semibold text-gray-800">{report.clinic}</p>
            </div>
          </div>

          {/* Key Findings */}
          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-3">
              {t('keyFindings', 'Key Findings')}
            </h2>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-gray-700 leading-relaxed">{report.findings}</p>
            </div>
          </div>

          {/* AI Summary */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-indigo-700 flex items-center">
                <Sparkles className="h-5 w-5 mr-2" />
                {t('aiSummary', 'AI-Generated Summary')}
              </h2>
              {!aiSummary && !isGenerating && (
                <Button
                  onClick={handleGenerateSummary}
                  size="sm"
                  variant="outline"
                  className="text-indigo-700 border-indigo-200 hover:bg-indigo-50"
                >
                  {t('generateSummary', 'Generate Summary')}
                </Button>
              )}
            </div>

            <Alert className="bg-indigo-50 border-indigo-200">
              <AlertDescription>
                {isGenerating ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600" />
                    <span className="text-indigo-800">
                      {t('generating', 'Generating summary...')}
                    </span>
                  </div>
                ) : aiSummary ? (
                  <p className="text-indigo-800">{aiSummary}</p>
                ) : (
                  <p className="text-indigo-600">
                    {t('aiSummaryPrompt', 'Click "Generate Summary" to get an AI-powered explanation')}
                  </p>
                )}
              </AlertDescription>
            </Alert>
          </div>

          {/* Document Viewer Placeholder */}
          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-3">
              {t('document', 'Document')}
            </h2>
            <div className="w-full h-96 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 font-semibold">
                  {t('documentViewer', 'Document Viewer')}
                </p>
                <p className="text-sm text-gray-400">
                  {t('documentViewerPlaceholder', 'PDF/Image preview will appear here')}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-center">
            <Button size="lg" className="w-full sm:w-auto">
              <Download className="mr-2 h-5 w-5" />
              {t('downloadReport', 'Download Report')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}