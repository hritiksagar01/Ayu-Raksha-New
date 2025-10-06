// src/app/patient/dashboard/layout.tsx
'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Home, 
  Calendar, 
  FileText, 
  Users, 
  Bell, 
  MessageSquare, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useStore } from '@/lib/store';
import { translations } from '@/constants/translations';
import { getTranslation } from '@/lib/translations';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  translationKey: string;
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/patient/dashboard', icon: Home, translationKey: 'dashboard' },
  { name: 'Timeline', href: '/patient/dashboard/timeline', icon: Calendar, translationKey: 'timeline' },
  { name: 'Alerts', href: '/patient/dashboard/alerts', icon: Bell, translationKey: 'alerts' },
  { name: 'Find Doctors', href: '/patient/dashboard/doctors', icon: Users, translationKey: 'findDoctors' },
  { name: 'Chatbot', href: '/patient/dashboard/chatbot', icon: MessageSquare, translationKey: 'chatbot' },
  { name: 'Reports', href: '/patient/dashboard/reports', icon: FileText, translationKey: 'reports' },
];

export default function PatientDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { selectedLanguage, user } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const t = (key: string, fallback?: string) =>
    getTranslation(translations, key, selectedLanguage, fallback);

  const handleLogout = () => {
    // Add logout logic here
    router.push('/');
  };

  const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/patient/dashboard', icon: Home, translationKey: 'dashboard' },
  { name: 'Timeline', href: '/patient/dashboard/timeline', icon: Calendar, translationKey: 'timeline' },
  { name: 'Alerts', href: '/patient/dashboard/alerts', icon: Bell, translationKey: 'alerts' },
  { name: 'Find Doctors', href: '/patient/dashboard/doctors', icon: Users, translationKey: 'findDoctors' },
  { name: 'Chatbot', href: '/patient/dashboard/chatbot', icon: MessageSquare, translationKey: 'chatbot' },
  { name: 'Reports', href: '/patient/dashboard/reports', icon: FileText, translationKey: 'reports' }, // ✅ Add this
];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b">
            <span className="text-2xl font-bold text-blue-600">Ayu Raksha</span>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* User info */}
          <div className="p-4 border-b">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="bg-blue-100 text-blue-600">
                  {user?.name?.charAt(0) || 'K'}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-gray-900">{user?.name || 'Krishna Kumar'}</p>
                <p className="text-sm text-gray-500">{t('patient', 'Patient')}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 py-4">
            <nav className="space-y-1 px-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Button
                    key={item.href}
                    variant={isActive ? 'secondary' : 'ghost'}
                    className={`w-full justify-start ${
                      isActive ? 'bg-blue-50 text-blue-600' : ''
                    }`}
                    onClick={() => {
                      router.push(item.href);
                      setSidebarOpen(false);
                    }}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {t(item.translationKey, item.name)}
                  </Button>
                );
              })}
            </nav>
          </ScrollArea>

          {/* Logout */}
          <div className="p-4 border-t">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="mr-3 h-5 w-5" />
              {t('logout', 'Logout')}
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-10 flex h-16 bg-white border-b shadow-sm">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden ml-4"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>
          <div className="flex-1 flex items-center justify-between px-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {navigation.find(item => item.href === pathname)?.name || t('dashboard', 'Dashboard')}
            </h2>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}