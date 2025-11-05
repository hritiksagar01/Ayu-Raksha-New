// src/app/uploader/dashboard/layout.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function UploaderDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isLoading } = useStore();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/uploader/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <LoadingSpinner isOverlay />;
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
