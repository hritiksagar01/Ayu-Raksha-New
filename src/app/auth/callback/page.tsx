'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { authApi } from '@/lib/api';
import { useStore } from '@/lib/store';
import LoadingSpinner from '@/components/common/LoadingSpinner';

function parseHashParams(hash: string): Record<string, string> {
  const trimmed = hash.replace(/^#/, '');
  const params = new URLSearchParams(trimmed);
  const result: Record<string, string> = {};
  params.forEach((value, key) => {
    result[key] = value;
  });
  return result;
}

// Split into a parent with Suspense and a child that uses useSearchParams,
// to satisfy Next.js requirement for a Suspense boundary.
export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center p-6"><LoadingSpinner isOverlay={false} text="Loading..." /></div>}>
      <AuthCallbackContent />
    </Suspense>
  );
}

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser, setProcessing, setLoading } = useStore();
  const [error, setError] = useState<string>('');
  const [portalHint, setPortalHint] = useState<'patient' | 'uploader' | 'doctor' | null>(null);

  useEffect(() => {
    async function finishSignIn() {
      try {
        // Ensure any global overlay spinners are cleared
        setProcessing(false);
        setLoading(false);

        // Prefer explicit portal from query (more reliable than localStorage)
        const explicitPortal = searchParams.get('portal');
        if (explicitPortal && typeof window !== 'undefined') {
          localStorage.setItem('lastPortal', explicitPortal);
        }

        // 1) Extract tokens
        const hash = typeof window !== 'undefined' ? window.location.hash : '';
        const hashParams = parseHashParams(hash);
        const accessTokenFromHash = hashParams['access_token'];
        const refreshTokenFromHash = hashParams['refresh_token'];

        let accessToken = accessTokenFromHash;
        let refreshToken = refreshTokenFromHash;

        // Optional: handle PKCE code flow (?code=...)
        const code = searchParams.get('code');
        if (!accessToken && code) {
          // If using PKCE OAuth, exchange the code for a session
          // Note: supabase-js v2 supports exchangeCodeForSession in browser
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
          accessToken = data.session?.access_token || '';
          refreshToken = data.session?.refresh_token || '';
        }

        if (!accessToken || !refreshToken) {
          throw new Error('Missing access token. Please try logging in again.');
        }

        // 2) Set Supabase session
        const { error: setSessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        if (setSessionError) throw setSessionError;

        // 3) Get user info from Supabase (email/name)
        const { data: userData, error: userErr } = await supabase.auth.getUser();
        if (userErr) throw userErr;
        const email = userData.user?.email || '';
        const name = (userData.user?.user_metadata as any)?.name as string | undefined;

        // 4) Determine portal (prefer explicit query, else lastPortal, else patient)
        const lastPortal = typeof window !== 'undefined' ? localStorage.getItem('lastPortal') : null;
        const userType = (explicitPortal as any) || (lastPortal as any) || 'patient';
        setPortalHint(userType);

        // 5) Sync with backend to obtain JWT
        const sync = await authApi.syncWithSupabaseToken(accessToken, userType, { email, name });
        if (!sync.success) {
          throw new Error(sync.error || 'Failed to sync with backend');
        }

        // 6) Update store and redirect
        setUser(sync.data.user);
        const nextRoute = userType === 'uploader' ? '/uploader/dashboard' : userType === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard';

        // Clean up URL hash/query
        if (typeof window !== 'undefined') {
          window.history.replaceState({}, document.title, window.location.pathname);
        }

        router.replace(nextRoute);
      } catch (e: any) {
        setProcessing(false);
        setLoading(false);
        setError(e?.message || 'Authentication failed.');
      }
    }

    finishSignIn();
  }, [router, searchParams, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      {error ? (
        <div className="max-w-md w-full text-center">
          <h1 className="text-xl font-semibold mb-2">Authentication Error</h1>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            className="px-4 py-2 rounded bg-blue-600 text-white"
            onClick={() => router.replace(portalHint === 'uploader' ? '/uploader/login' : portalHint === 'doctor' ? '/doctor/login' : '/patient/login')}
          >
            Go to Login
          </button>
        </div>
      ) : (
        <LoadingSpinner isOverlay={false} text="Finishing sign-in..." />
      )}
    </div>
  );
}
