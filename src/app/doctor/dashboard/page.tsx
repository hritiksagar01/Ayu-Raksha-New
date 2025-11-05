"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { translations } from '@/constants/translations';

export default function DoctorDashboardPage() {
  const router = useRouter();
  const { user, selectedLanguage } = useStore();

  useEffect(() => {
    // If not logged in, bounce to login
    if (!user) {
      router.replace('/doctor/login');
    }
  }, [user, router]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header translations={translations} />
      <main className="flex-grow p-6">
        <Card>
          <CardHeader>
            <CardTitle>Doctor Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Welcome {user?.name || 'Doctor'}. Your portal is ready.</p>
          </CardContent>
        </Card>
      </main>
      <Footer translations={translations} selectedLanguage={selectedLanguage} />
    </div>
  );
}
