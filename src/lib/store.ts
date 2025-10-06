// src/lib/store.ts
'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import Cookies from 'js-cookie';
import type { User } from '@/types';

interface StoreState {
  // User state
  user: User | null;
  isAuthenticated: boolean;
  
  // UI state
  selectedLanguage: string;
  isLoading: boolean;
  isProcessing: boolean;
  
  // Device info
  osType: 'android' | 'windows' | 'other' | 'unknown';
  screenSize: number;
  
  // Actions
  setUser: (user: User | null) => void;
  clearUser: () => void;
  setLanguage: (language: string) => void;
  setLoading: (isLoading: boolean) => void;
  setProcessing: (isProcessing: boolean) => void;
  setOsType: (osType: 'android' | 'windows' | 'other' | 'unknown') => void;
  setScreenSize: (size: number) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      selectedLanguage: 'English',
      isLoading: true,
      isProcessing: false,
      osType: 'unknown',
      screenSize: typeof window !== 'undefined' ? window.innerWidth : 1024,
      
      // Actions
      setUser: (user) => {
        if (user) {
          Cookies.set('user', JSON.stringify(user), { expires: 7 });
        }
        set({ user, isAuthenticated: !!user });
      },
      
      clearUser: () => {
        Cookies.remove('auth_token'); // ✅ Changed from jwt_token
        Cookies.remove('user');
        set({ user: null, isAuthenticated: false });
      },
      
      setLanguage: (language) => set({ selectedLanguage: language }),
      setLoading: (isLoading) => set({ isLoading }),
      setProcessing: (isProcessing) => set({ isProcessing }),
      setOsType: (osType) => set({ osType }),
      setScreenSize: (size) => set({ screenSize: size }),
    }),
    {
      name: 'ayu-raksha-storage',
      storage: createJSONStorage(() => localStorage),
      // ✅ Use 'partialize' instead of 'partialPersist'
      partialize: (state) => ({
        selectedLanguage: state.selectedLanguage,
        user: state.user, // ✅ Also persist user
        isAuthenticated: state.isAuthenticated, // ✅ Also persist auth state
      }),
    }
  )
);