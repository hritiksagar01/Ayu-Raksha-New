// src/components/auth/GoogleAuthButton.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Chrome } from 'lucide-react';

interface GoogleAuthButtonProps {
  onSuccess: (response: any) => void;
  onError?: (error: any) => void;
  disabled?: boolean;
  text?: string;
}

export default function GoogleAuthButton({
  onSuccess,
  onError,
  disabled = false,
  text = 'Sign up with Google',
}: GoogleAuthButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleGoogleSignup = async () => {
    setLoading(true);
    
    try {
      // For now, we'll simulate Google OAuth
      // In production, you'll integrate Google OAuth 2.0
      
      // Simulate Google OAuth response
      setTimeout(() => {
        const mockGoogleResponse = {
          name: 'Test User',
          email: 'test@gmail.com',
          picture: 'https://via.placeholder.com/150',
          sub: 'google_' + Date.now(),
        };
        
        onSuccess(mockGoogleResponse);
        setLoading(false);
      }, 1500);
      
      // TODO: Implement real Google OAuth
      // Example with Google Identity Services:
      /*
      const response = await new Promise((resolve, reject) => {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          callback: resolve,
        });
        window.google.accounts.id.prompt();
      });
      onSuccess(response);
      */
      
    } catch (error) {
      setLoading(false);
      if (onError) {
        onError(error);
      }
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      onClick={handleGoogleSignup}
      disabled={disabled || loading}
    >
      <Chrome className="w-5 h-5 mr-2" />
      {loading ? 'Connecting to Google...' : text}
    </Button>
  );
}