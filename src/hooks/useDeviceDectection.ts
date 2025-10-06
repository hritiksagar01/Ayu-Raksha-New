// src/hooks/useDeviceDetection.ts
'use client';

import { useEffect } from 'react';
import { useStore } from '@/lib/store';

/**
 * Custom hook to detect device OS and screen size
 * Automatically updates Zustand store
 */
export function useDeviceDetection() {
  const { setOsType, setScreenSize } = useStore();

  useEffect(() => {
    // Detect operating system
    const userAgent = window.navigator.userAgent || window.navigator.vendor;
    
    if (/android/i.test(userAgent)) {
      setOsType('android');
    } else if (/windows/i.test(userAgent)) {
      setOsType('windows');
    } else {
      setOsType('other');
    }

    // Set initial screen size
    setScreenSize(window.innerWidth);

    // Handle window resize
    const handleResize = () => {
      setScreenSize(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [setOsType, setScreenSize]);
}