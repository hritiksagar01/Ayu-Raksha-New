// src/app/uploader/upload/page.tsx
'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, FileText, CheckCircle, AlertCircle, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { useStore } from '@/lib/store';
import { translations } from '@/constants/translations';
import { getTranslation } from '@/lib/translations';
import { useToast } from '@/hooks/use-toast';
import { uploadApi, patientApi } from '@/lib/api';

interface UploadStatus {
  status: 'idle' | 'uploading' | 'success' | 'error';
  progress: number;
  message: string;
}

export default function UploaderUploadPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { selectedLanguage } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [patientId, setPatientId] = useState('');
  const [patientInfo, setPatientInfo] = useState<{ name: string; age: number; sex: string } | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<{ message: string; type: 'success' | 'error' | '' }>({ message: '', type: '' });
  
  const [documentType, setDocumentType] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({ status: 'idle', progress: 0, message: '' });
  const [isVerifying, setIsVerifying] = useState(false);

  const t = (key: string, fallback?: string) =>
    getTranslation(translations, key, selectedLanguage, fallback);

  // Document types matching backend
  const documentTypes = [
    { value: 'blood-report', label: t('bloodReport', 'Blood Report') },
    { value: 'mri-scan', label: t('mriScan', 'MRI Scan') },
    { value: 'xray', label: t('xRay', 'X-Ray') },
    { value: 'ct-scan', label: t('ctScan', 'CT Scan') },
    { value: 'prescription', label: t('prescription', 'Prescription') },
    { value: 'pathology', label: t('pathologyReport', 'Pathology Report') },
    { value: 'ultrasound', label: t('ultrasound', 'Ultrasound') },
    { value: 'ecg', label: t('ecg', 'ECG Report') },
    { value: 'other', label: t('other', 'Other') },
  ];

  // Verify Patient ID
  const handleVerifyId = async () => {
    console.log('🔍 Verify button clicked, Patient ID:', patientId);
    
    if (!patientId || patientId.trim() === '') {
      console.log('❌ Patient ID is empty');
      setVerificationStatus({ 
        message: t('invalidPatientId', 'Please enter a valid Patient ID'), 
        type: 'error' 
      });
      setPatientInfo(null);
      return;
    }

    // Basic validation - check if it's numeric and reasonable length
    if (!/^\d+$/.test(patientId) || patientId.length < 10 || patientId.length > 20) {
      console.log('❌ Patient ID validation failed:', { length: patientId.length, isNumeric: /^\d+$/.test(patientId) });
      setVerificationStatus({ 
        message: t('invalidPatientId', 'Please enter a valid Patient ID (10-20 digits)'), 
        type: 'error' 
      });
      setPatientInfo(null);
      return;
    }

    console.log('✅ Patient ID format valid, calling API...');
    setIsVerifying(true);
    setVerificationStatus({ message: '', type: '' });

    try {
      // Call backend API to verify patient
      const response = await patientApi.verifyPatient(patientId);
      
      console.log('API Response:', response);

      if (response.success && response.data) {
        console.log('✅ Patient found:', response.data);
        
        // Map backend response to expected format
        const patient = {
          name: response.data.name,
          age: response.data.age,
          sex: response.data.gender || 'Unknown',
        };
        
        setPatientInfo(patient);
        setVerificationStatus({ 
          message: `${t('patientVerified', 'Patient verified')}: ${patient.name}`, 
          type: 'success' 
        });
        
        toast({
          title: t('success', 'Success!'),
          description: `${t('patientVerified', 'Patient verified')}: ${patient.name}`,
        });
      } else {
        console.log('❌ Patient not found or API error');
        setPatientInfo(null);
        setVerificationStatus({ 
          message: response.error || t('patientNotFound', 'Patient not found. Please check the ID.'), 
          type: 'error' 
        });
        
        toast({
          variant: 'destructive',
          title: t('patientNotFound', 'Patient not found'),
          description: response.error || 'Please check the ID and try again.',
        });
      }
    } catch (error: unknown) {
      console.error('❌ Verification error:', error);
      setPatientInfo(null);
      setVerificationStatus({ 
        message: t('verificationError', 'Error verifying patient. Please try again.'), 
        type: 'error' 
      });
      
      toast({
        variant: 'destructive',
        title: t('verificationError', 'Verification Error'),
        description: (error as Error).message || 'Unable to verify patient. Please try again.',
      });
    } finally {
      setIsVerifying(false);
    }
  };

  // File selection handlers
  const handleFileSelect = (files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        toast({
          variant: 'destructive',
          title: t('invalidFileType', 'Invalid file type'),
          description: t('onlyImagesAndPDF', 'Only JPG, PNG, and PDF files are allowed'),
        });
        return;
      }

      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        toast({
          variant: 'destructive',
          title: t('fileTooLarge', 'File too large'),
          description: t('maxFileSize', 'Maximum file size is 10MB'),
        });
        return;
      }

      setSelectedFile(file);
      setUploadStatus({ status: 'idle', progress: 0, message: '' });
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    setUploadStatus({ status: 'idle', progress: 0, message: '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Upload handler
  const handleUpload = async () => {
    if (!patientInfo) {
      toast({
        variant: 'destructive',
        title: t('verificationRequired', 'Verification Required'),
        description: t('verifyPatientFirst', 'Please verify the patient ID first'),
      });
      return;
    }

    if (!documentType) {
      toast({
        variant: 'destructive',
        title: t('documentTypeRequired', 'Document Type Required'),
        description: t('selectDocumentType', 'Please select a document type'),
      });
      return;
    }

    if (!selectedFile) {
      toast({
        variant: 'destructive',
        title: t('fileRequired', 'File Required'),
        description: t('selectFileToUpload', 'Please select a file to upload'),
      });
      return;
    }

    try {
      setUploadStatus({ status: 'uploading', progress: 0, message: t('uploading', 'Uploading...') });

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadStatus(prev => {
          if (prev.progress >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return { ...prev, progress: prev.progress + 10 };
        });
      }, 200);

      // Call backend API
      const response = await uploadApi.uploadFile(patientId, documentType, selectedFile);

      clearInterval(progressInterval);

      if (response.success) {
        setUploadStatus({ 
          status: 'success', 
          progress: 100, 
          message: t('uploadSuccess', 'File uploaded successfully!') 
        });

        toast({
          title: t('success', 'Success!'),
          description: t('fileUploadedSuccessfully', 'Medical document uploaded successfully'),
        });

        // Reset form after 2 seconds
        setTimeout(() => {
          setPatientId('');
          setPatientInfo(null);
          setVerificationStatus({ message: '', type: '' });
          setDocumentType('');
          setSelectedFile(null);
          setUploadStatus({ status: 'idle', progress: 0, message: '' });
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }, 2000);

      } else {
        throw new Error(response.error || 'Upload failed');
      }

    } catch (error: unknown) {
      console.error('Upload error:', error);
      setUploadStatus({ 
        status: 'error', 
        progress: 0, 
        message: (error as Error).message || t('uploadFailed', 'Upload failed. Please try again.') 
      });

      toast({
        variant: 'destructive',
        title: t('uploadError', 'Upload Error'),
        description: (error as Error).message || t('uploadFailed', 'Upload failed. Please try again.'),
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header translations={translations} />

      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('uploadMedicalDocument', 'Upload Medical Document')}
          </h1>
          <p className="text-gray-600">
            {t('uploadDocumentDescription', 'Upload patient medical records securely to the system')}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('documentUploadForm', 'Document Upload Form')}</CardTitle>
            <CardDescription>
              {t('fillDetailsBelow', 'Fill in the patient details and upload the document')}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Patient ID Verification */}
            <div>
              <Label htmlFor="patientId" className="text-base font-semibold mb-3 block">
                {t('step1', 'Step 1')}: {t('verifyPatient', 'Verify Patient')}
              </Label>
              
              <div className="flex gap-2">
                <Input
                  id="patientId"
                  type="text"
                  placeholder={t('enterPatientId', 'Enter Patient ID')}
                  value={patientId}
                  onChange={(e) => {
                    setPatientId(e.target.value);
                    setVerificationStatus({ message: '', type: '' });
                    setPatientInfo(null);
                  }}
                  disabled={isVerifying}
                  className="flex-1"
                />
                <Button 
                  type="button"
                  onClick={handleVerifyId}
                  variant="outline"
                  className="min-w-[100px]"
                  disabled={isVerifying || !patientId}
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {t('verifying', 'Verifying...')}
                    </>
                  ) : (
                    t('verify', 'Verify')
                  )}
                </Button>
              </div>

              {verificationStatus.message && (
                <Alert 
                  className={`mt-3 ${verificationStatus.type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}
                >
                  <AlertDescription className={verificationStatus.type === 'success' ? 'text-green-800' : 'text-red-800'}>
                    {verificationStatus.type === 'success' ? (
                      <CheckCircle className="inline w-4 h-4 mr-2" />
                    ) : (
                      <AlertCircle className="inline w-4 h-4 mr-2" />
                    )}
                    {verificationStatus.message}
                  </AlertDescription>
                </Alert>
              )}

              {patientInfo && (
                <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-semibold text-gray-700">{t('name', 'Name')}:</span>
                      <p className="text-gray-900">{patientInfo.name}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">{t('age', 'Age')}:</span>
                      <p className="text-gray-900">{patientInfo.age}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">{t('gender', 'Gender')}:</span>
                      <p className="text-gray-900">{patientInfo.sex}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Document Type Selection */}
            <div>
              <Label htmlFor="documentType" className="text-base font-semibold mb-3 block">
                {t('step2', 'Step 2')}: {t('selectDocumentType', 'Select Document Type')}
              </Label>
              <Select value={documentType} onValueChange={setDocumentType}>
                <SelectTrigger id="documentType">
                  <SelectValue placeholder={t('chooseDocumentType', 'Choose document type')} />
                </SelectTrigger>
                <SelectContent>
                  {documentTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* File Upload */}
            <div>
              <Label className="text-base font-semibold mb-3 block">
                {t('step3', 'Step 3')}: {t('uploadDocument', 'Upload Document')}
              </Label>

              {!selectedFile ? (
                <div
                  className={`mt-2 flex justify-center px-6 pt-10 pb-12 border-2 border-dashed rounded-lg transition-colors cursor-pointer ${
                    isDragActive ? 'border-purple-500 bg-purple-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onDragEnter={handleDragEnter}
                  onDragOver={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">
                      {t('dragDropFile', 'Drag and drop your file here, or click to browse')}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {t('supportedFormats', 'Supported formats: JPG, PNG, PDF (Max 10MB)')}
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={(e) => handleFileSelect(e.target.files)}
                    />
                  </div>
                </div>
              ) : (
                <div className="mt-2 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="h-10 w-10 text-purple-600" />
                      <div>
                        <p className="font-medium text-gray-900">{selectedFile.name}</p>
                        <p className="text-sm text-gray-500">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={removeSelectedFile}
                      className="text-gray-500 hover:text-red-600"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Upload Progress */}
            {uploadStatus.status !== 'idle' && (
              <div className="space-y-2">
                {uploadStatus.status === 'uploading' && (
                  <>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadStatus.progress}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {uploadStatus.message} ({uploadStatus.progress}%)
                    </p>
                  </>
                )}

                {uploadStatus.status === 'success' && (
                  <Alert className="bg-green-50 border-green-200">
                    <AlertDescription className="text-green-800 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      {uploadStatus.message}
                    </AlertDescription>
                  </Alert>
                )}

                {uploadStatus.status === 'error' && (
                  <Alert className="bg-red-50 border-red-200">
                    <AlertDescription className="text-red-800 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      {uploadStatus.message}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleUpload}
                disabled={!patientInfo || !documentType || !selectedFile || uploadStatus.status === 'uploading'}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                {uploadStatus.status === 'uploading' ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t('uploading', 'Uploading...')}
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    {t('uploadDocument', 'Upload Document')}
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push('/uploader/dashboard')}
                disabled={uploadStatus.status === 'uploading'}
              >
                {t('cancel', 'Cancel')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer translations={translations} selectedLanguage={selectedLanguage} />
    </div>
  );
}
