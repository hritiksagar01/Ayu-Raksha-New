// src/app/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { translations } from '@/constants/translations';
import { PORTALS } from '@/constants/portals';
import { FEATURES } from '@/constants/features';
import { useDeviceDetection } from '@/hooks/useDeviceDectection';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import HeroSection from '@/components/features/HeroSection';
import PortalCard from '@/components/features/PortalCard';
import FeatureCard from '@/components/features/FeatureCard';

// Page-level styles
const PAGE_STYLES = {
  root: 'min-h-screen flex flex-col',
  main: 'flex-grow flex items-center justify-center px-4 py-22  ',
  container: 'w-full max-w-6xl',
  portalGrid: 'grid grid-cols-1 md:grid-cols-3 gap-6',
  featureGrid: 'mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center',
} as const;

export default function EntryPage() {
  const router = useRouter();
  const { selectedLanguage, isLoading, setLoading } = useStore();
  
  // Device detection hook
  useDeviceDetection();

  // Initialize loading state
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [setLoading]);

  // If Supabase redirected back with tokens in the URL, forward to the auth callback handler
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash || '';
    const params = new URLSearchParams(window.location.search);
    const lastPortal = localStorage.getItem('lastPortal');
    if (hash.includes('access_token=')) {
      const qp = lastPortal ? `?portal=${encodeURIComponent(lastPortal)}` : '';
      router.replace(`/auth/callback${qp}${hash}`);
    } else if (params.has('code')) {
      // OAuth/PKCE code flow
      const qs = params.toString();
      const prefix = lastPortal ? `portal=${encodeURIComponent(lastPortal)}&` : '';
      router.replace(`/auth/callback?${prefix}${qs}`);
    }
  }, [router]);

  // Navigation handlers
  const handlePortalLogin = (portalId: string) => {
    router.push(`/${portalId}/login`);
  };

  const handlePortalSignup = (portalId: string) => {
    router.push(`/${portalId}/signup`);
  };
 

  // Loading state
  if (isLoading) {
    return (
      <LoadingSpinner 
        isOverlay 
      />
    );
  }

  return (
    <div className={PAGE_STYLES.root}>
      <Header translations={translations} />
      
      <main className={PAGE_STYLES.main}>
        <div className={PAGE_STYLES.container}>
          {/* Hero Section */}
          <HeroSection 
            translations={translations} 
            selectedLanguage={selectedLanguage} 
          />

         
          <section className={PAGE_STYLES.portalGrid}>
            {PORTALS.map((portal) => (
              <PortalCard
                key={portal.id}
                portal={portal}
                translations={translations}
                selectedLanguage={selectedLanguage}
                onLoginClick={() => handlePortalLogin(portal.id)}
                onSignupClick={() => handlePortalSignup(portal.id)}
              />
            ))}
          </section>

          {/* Features Section */}
          <section className={PAGE_STYLES.featureGrid}>
            {FEATURES.map((feature, index) => (
              <FeatureCard
                key={index}
                feature={feature}
                translations={translations}
                selectedLanguage={selectedLanguage}
              />
            ))}
          </section>
        </div>
      </main>

      <Footer 
        translations={translations} 
        selectedLanguage={selectedLanguage} 
      />
    </div>
  );
}