// src/components/common/Header.tsx
'use client';

import { useRouter } from 'next/navigation';
import { LogOut, User as UserIcon, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useStore } from '@/lib/store';
import type { Translations } from '@/types';

interface HeaderProps {
  translations: Translations;
}

export default function Header({ translations }: HeaderProps) {
  const router = useRouter();
  const { user, selectedLanguage, setLanguage, clearUser } = useStore();
  
  const handleLogout = () => {
    clearUser();
    router.push('/');
  };
  
  const handleLanguageChange = (language: string) => {
    setLanguage(language);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-40 h-16">
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">A</span>
          </div>
          <h1 className="text-xl font-bold text-gray-800">Ayu Raksha</h1>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Language Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Globe className="w-4 h-4 mr-2" />
                {selectedLanguage}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleLanguageChange('English')}>
                English
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleLanguageChange('Hindi')}>
                हिन्दी (Hindi)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <UserIcon className="w-4 h-4 mr-2" />
                  {user.name}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  {translations.logout[selectedLanguage]}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}