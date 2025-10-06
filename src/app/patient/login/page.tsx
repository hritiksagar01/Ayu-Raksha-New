// src/app/patient/login/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserCircle, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useStore } from '@/lib/store';
import { authApi } from '@/lib/api';
import { translations } from '@/constants/translations';
import { getTranslation } from '@/lib/translations';
import { loginSchema, type LoginFormData } from '@/lib/validations/login';
import { PORTAL_CONFIGS } from '@/config/portals.config';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const portalConfig = PORTAL_CONFIGS.patient;

export default function PatientLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { selectedLanguage, setUser, setProcessing, isProcessing } = useStore();
  const [error, setError] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);

  const t = (key: string, fallback?: string) =>
    getTranslation(translations, key, selectedLanguage, fallback);

  const Icon = portalConfig.icon;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',        // ✅ Changed to email
      password: '',
      rememberMe: false,
    },
  });

  // Load remembered email
  useEffect(() => {
    const remembered = localStorage.getItem('rememberMe');
    const savedEmail = localStorage.getItem('email');
    if (remembered === 'true' && savedEmail) {
      setValue('email', savedEmail);
      setValue('rememberMe', true);
    }
  }, [setValue]);

  const onSubmit = async (data: LoginFormData) => {
    console.log('🔐 Login Form Data:', data);
    
    setError('');
    setProcessing(true);

    try {
      const response = await authApi.login(
        { 
          email: data.email,        // ✅ Changed to email
          password: data.password 
        },
        portalConfig.id
      );

      console.log('✅ Login Response:', response);

      if (response.success) {
        setUser(response.data.user);

        toast({
          title: t('loginSuccess', 'Login successful!'),
          description: `${t('welcomeBack', 'Welcome back')}, ${response.data.user.name}!`,
        });

        if (data.rememberMe) {
          localStorage.setItem('rememberMe', 'true');
          localStorage.setItem('email', data.email);  // ✅ Changed to email
        } else {
          localStorage.removeItem('rememberMe');
          localStorage.removeItem('email');
        }

        setTimeout(() => router.push(portalConfig.dashboardRoute), 1500);
      } else {
        setError(response.error || t('loginError', 'Invalid email or password'));
        toast({
          variant: 'destructive',
          title: 'Error',
          description: response.error || t('loginError', 'Invalid email or password'),
        });
      }
    } catch (err: any) {
      console.error('❌ Login Error:', err);
      const errorMsg = err.response?.data?.error || 'An error occurred. Please try again.';
      setError(errorMsg);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: errorMsg,
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleGoogleLogin = async () => {
    setProcessing(true);
    try {
      setTimeout(() => {
        const mockGoogleResponse = {
          name: 'Krishna Kumar',
          email: 'krishna@gmail.com',
          picture: 'https://via.placeholder.com/150',
          sub: 'google_' + Date.now(),
        };

        authApi
          .googleSignup(
            {
              name: mockGoogleResponse.name,
              email: mockGoogleResponse.email,
              avatar: mockGoogleResponse.picture,
              googleId: mockGoogleResponse.sub,
            },
            portalConfig.id
          )
          .then((response) => {
            if (response.success) {
              setUser(response.data.user);
              toast({
                title: t('loginSuccess', 'Login successful!'),
                description: `${t('welcomeBack', 'Welcome back')}, ${response.data.user.name}!`,
              });
              setTimeout(() => router.push(portalConfig.dashboardRoute), 1500);
            } else {
              toast({
                variant: 'destructive',
                title: 'Error',
                description: response.error || 'Google login failed',
              });
            }
          })
          .finally(() => setProcessing(false));
      }, 1500);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to login with Google',
      });
      setProcessing(false);
    }
  };

  if (isProcessing) {
    return <LoadingSpinner isOverlay text={t('processingText', 'Processing...')} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header translations={translations} />

      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className={`mx-auto w-16 h-16 ${portalConfig.iconBg} rounded-full flex items-center justify-center mb-4`}>
              <Icon className={`w-10 h-10 ${portalConfig.iconColor}`} />
            </div>
            <CardTitle className="text-center text-2xl">
              {t('loginToAccount', 'Login to your account')}
            </CardTitle>
            <CardDescription className="text-center">
              {t('loginDescription', 'Enter your credentials to access your account')}
            </CardDescription>
            <div className="text-center">
              <Button
                variant="link"
                onClick={() => router.push(portalConfig.signupRoute)}
                className="text-sm"
              >
                {t('dontHaveAccount', "Don't have an account?")} {t('signup', 'Sign Up')}
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            {/* Demo Credentials Info */}
            <Alert className="mb-4 bg-blue-50 border-blue-200">
              <AlertDescription className="text-blue-800 text-sm">
                <div className="space-y-1">
                  <p className="font-semibold">Demo Credentials:</p>
                  <p><strong>Email:</strong> hritik.srivastava15@gmail.com</p>
                  <p><strong>Password:</strong> 12345678</p>
                </div>
              </AlertDescription>
            </Alert>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-4">
                {/* Email */}
                <div className="grid gap-2">
                  <Label htmlFor="email">{t('email', 'Email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="patient@demo.com"
                    {...register('email')}
                    disabled={isProcessing}
                    autoComplete="email"
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>

                {/* Password */}
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">{t('password', 'Password')}</Label>
                    <Button
                      type="button"
                      variant="link"
                      className="px-0 text-sm"
                      onClick={() => router.push('/forgot-password')}
                    >
                      {t('forgotPassword', 'Forgot password?')}
                    </Button>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      {...register('password')}
                      disabled={isProcessing}
                      autoComplete="current-password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password.message}</p>
                  )}
                </div>

                {/* Remember Me */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="rememberMe"
                    checked={watch('rememberMe')}
                    onCheckedChange={(checked) => setValue('rememberMe', checked as boolean)}
                  />
                  <Label htmlFor="rememberMe" className="text-sm font-normal cursor-pointer">
                    {t('rememberMe', 'Remember me')}
                  </Label>
                </div>

                {/* Error Alert */}
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Submit button */}
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={isProcessing}
                >
                  {isProcessing ? t('loggingIn', 'Logging in...') : t('login', 'Login')}
                </Button>
              </div>
            </form>
          </CardContent>

          <CardFooter className="flex-col gap-3">
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  {t('orContinueWith', 'Or continue with')}
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogleLogin}
              disabled={isProcessing}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {t('loginWithGoogle', 'Login with Google')}
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => router.push('/')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('back', 'Back to Home')}
            </Button>
          </CardFooter>
        </Card>
      </main>

      <Footer translations={translations} selectedLanguage={selectedLanguage} />
    </div>
  );
}