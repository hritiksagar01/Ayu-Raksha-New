// src/components/auth/SignupHeader.tsx
'use client';

import { LucideIcon } from 'lucide-react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/className';

interface SignupHeaderProps {
  icon: LucideIcon;
  iconColorClass: string;
  iconBgClass: string;
  title: string;
  description: string;
}

export default function SignupHeader({
  icon: Icon,
  iconColorClass,
  iconBgClass,
  title,
  description,
}: SignupHeaderProps) {
  return (
    <CardHeader className="text-center">
      <div className={cn('mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4', iconBgClass)}>
        <Icon className={cn('w-10 h-10', iconColorClass)} />
      </div>
      <CardTitle className="text-2xl">{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
  );
}