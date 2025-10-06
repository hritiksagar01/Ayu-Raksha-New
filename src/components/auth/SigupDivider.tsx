// src/components/auth/SignupDivider.tsx
'use client';

import { Separator } from '@/components/ui/separator';

interface SignupDividerProps {
  text: string;
}

export default function SignupDivider({ text }: SignupDividerProps) {
  return (
    <div className="relative">
      <Separator />
      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-sm text-muted-foreground">
        {text}
      </span>
    </div>
  );
}