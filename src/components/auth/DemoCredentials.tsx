// src/components/auth/DemoCredentials.tsx
'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';

export default function DemoCredentials() {
  return (
    <Alert className="bg-blue-50 border-blue-200">
      <Info className="h-4 w-4 text-blue-600" />
      <AlertTitle className="text-blue-900">Demo Credentials</AlertTitle>
      <AlertDescription className="text-blue-800 text-sm">
        <div className="mt-2 space-y-1">
          <p><strong>Username:</strong> patient@demo.com</p>
          <p><strong>Password:</strong> demo1234</p>
        </div>
      </AlertDescription>
    </Alert>
  );
}