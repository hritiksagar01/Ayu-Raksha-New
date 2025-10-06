// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Ayu Raksha - Healthcare Management System',
  description: 'Comprehensive healthcare management platform for patients, doctors, and medical facilities',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className='scroll-smooth'>
      <body className={`${inter.className} bg-gray-100 min-h-screen`}>
        {children}
      </body>
    </html>
  );
}